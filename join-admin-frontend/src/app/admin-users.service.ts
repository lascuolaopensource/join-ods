import {Injectable} from "@angular/core";
import {AuthService, Environment, User, UserService} from "@sos/sos-ui-shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {StatsTrend} from "./stats-shared";


export type AdminUser = User & {
  fullName: string
  isAdmin: boolean
  ideasCount: number
  skillsCount: number
}

export interface UserStat {
  id: number
  firstName: string
  lastName: string
  quantity: number
  trend: StatsTrend
}

export type AwardType =
  'teaching' | 'research' | 'ideas' | 'skills' | 'maker' | 'favored' | 'favorites'


@Injectable()
export class AdminUsersService extends UserService {

  constructor(http: Http, authService: AuthService, environment: Environment) {
    super(http, authService, environment);
  }

  public all(): Observable<AdminUser[]> {
    return this.http.get(`${this.backendUrl}/users`, this.options)
      .map(response => {
        const json = response.json();
        return json.users.map(userJson => {
          let user = User.fromJson(userJson) as AdminUser;
          user.fullName = `${user.firstName} ${user.lastName}`;
          user.isAdmin = userJson.isAdmin;
          user.ideasCount = userJson.ideasCount;
          user.skillsCount = user.skills.length;
          return user;
        });
      });
  }

  public find(userId: number): Observable<AdminUser> {
    return this.http.get(`${this.backendUrl}/users/${userId}`, this.options)
      .map(response => {
        const json = response.json();
        let base = User.fromJson(json) as AdminUser;
        base.isAdmin = json.isAdmin;
        return base
      })
  }

  public deleteUser(id: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/users/${id}`, this.options)
      .map(() => {});
  }

  public updateRole(id: number, admin: boolean): Observable<void> {
    let url = `${this.backendUrl}/users/${id}/role${admin ? '?admin' : ''}`;
    return this.http.put(url, {}, this.options)
      .map(() => {});
  }

  public getStats(path: AwardType, from: Date, to: Date): Observable<UserStat[]> {
    const url = `${this.backendUrl}/users/stats/${path}?from=${from.getTime()}&to=${to.getTime()}`;
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

}
