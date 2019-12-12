import {Injectable} from "@angular/core";
import {Skill, SkillsService, UserShort} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";
import {StatsTrend} from "app/stats-shared";


export type SkillWithLinked = Skill & { users: UserShort[] }

export interface SkillSlim {
  id: number
  name: string
}

export interface SkillAdmin extends SkillSlim {
  parent?: SkillSlim
  request: boolean
  usersCount: number
}

export interface SkillTopStat extends SkillSlim {
  count: number
  trend: StatsTrend
}

@Injectable()
export class AdminSkillsService extends SkillsService {

  public all(): Observable<Skill[]> {
    return this.http.get(`${this.backendUrl}/skills`, this.options)
      .map(response => {
        const json = response.json();
        return json.skills.map(Skill.fromJson)
      });
  }

  public requests(): Observable<SkillWithLinked[]> {
    return this.http.get(`${this.backendUrl}/skills/requests`, this.options)
      .map(response => {
        return response.json().requests.map(request => {
          const skill = Skill.fromJson(request.skill) as SkillWithLinked;
          skill.users = request.users;
          return skill;
        })
      });
  }

  public confirm(skillId: number, confirm: boolean): Observable<void> {
    const url = `${this.backendUrl}/skills/${skillId}/confirm${confirm ? '?confirm' : ''}`;
    return this.http.put(url, null, this.options).map(() => {});
  }

  public searchAdmin(name?: string, user?: string): Observable<SkillAdmin[]> {
    const qsParts = [];
    if (name)
      qsParts.push('name=' + name);
    if (user)
      qsParts.push('user=' + user);
    const qs = qsParts.length > 0 ? `?${qsParts.join('&')}` : '';
    return this.http.get(`${this.backendUrl}/skills/admin${qs}`, this.options)
      .map(response => response.json().skills);
  }

  public create(skill: Skill): Observable<Skill> {
    return this.http.post(`${this.backendUrl}/skills/admin`, skill, this.options)
      .map(response => {
        const json = response.json();
        return Skill.fromJson(json.skill);
      });
  }

  public update(skill: Skill): Observable<Skill> {
    return this.http.put(`${this.backendUrl}/skills/admin/${skill.id}`, skill, this.options)
      .map(response => {
        const json = response.json();
        return Skill.fromJson(json.skill);
      });
  }

  public find(skillId: number): Observable<SkillWithLinked> {
    return this.http.get(`${this.backendUrl}/skills/admin/${skillId}`, this.options)
      .map(response => {
        const json = response.json();
        const skill = Skill.fromJson(json.skill) as SkillWithLinked;
        skill.users = json.users;
        return skill;
      });
  }

  public moveSkills(fromSkillId: number, toSkillId: number): Observable<void> {
    return this.http.put(`${this.backendUrl}/skills/admin/${fromSkillId}/to/${toSkillId}`, null, this.options)
      .map(() => {});
  }

  public deleteSkill(skillId: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/skills/admin/${skillId}`, this.options)
      .map(() => {});
  }

  public deleteForUser(skillId: number, userId: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/skills/admin/${skillId}/${userId}`, this.options)
      .map(() => {});
  }

  public latest(): Observable<SkillSlim[]> {
    return this.http.get(`${this.backendUrl}/skills/stats/latest`, this.options)
      .map(r => r.json().skills);
  }

  public byUserCount(from: Date, to: Date): Observable<SkillTopStat[]> {
    const url = `${this.backendUrl}/skills/stats/by_user_count?from=${from.getTime()}&to=${to.getTime()}`;
    return this.http.get(url, this.options)
      .map(r => r.json().stats);
  }

}
