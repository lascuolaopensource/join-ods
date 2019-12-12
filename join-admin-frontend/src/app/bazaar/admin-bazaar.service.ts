import {Injectable} from "@angular/core";
import {BazaarIdeasService, IdeaType} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";
import {StatsTrend} from "../stats-shared";


export interface BazaarIdeaMini {
  id: number
  title: string
  ideaType: IdeaType
}

export interface BazaarIdeaStatRow {
  ideaId: number
  title: string
  score: number
  createdAt: Date
  userId: number
  firstName: string
  lastName: string
  ideaType: IdeaType
  trend?: StatsTrend
}

export interface BazaarIdeaStatCount {
  teaching: number
  event: number
  research: number
  total?: number
}

export interface BazaarTopCreator {
  id: number
  firstName: string
  lastName: string
  average: number
  ideasCount: number
  trend?: StatsTrend
}

@Injectable()
export class AdminBazaarService extends BazaarIdeasService {


  public deleteIdea(id: number, ideaType: IdeaType): Observable<void> {
    return this.http.delete(`${this.backendUrl}/bazaar_ideas/${ideaType}/${id}`, this.options)
      .map(() => {});
  }

  public byUser(userId: number): Observable<BazaarIdeaMini[]> {
    return this.http.get(`${this.backendUrl}/bazaar_ideas/user/${userId}`, this.options)
      .map(response => response.json().ideas);
  }

  public latest(to: Date): Observable<BazaarIdeaStatRow[]> {
    const url = `${this.backendUrl}/bazaar_ideas/stats/latest?to=${to.getTime()}`;
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  public count(to: Date): Observable<BazaarIdeaStatCount> {
    const url = `${this.backendUrl}/bazaar_ideas/stats/count?to=${to.getTime()}`;
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  private withFromToQuery(path: string, from: Date, to: Date) {
    return `${this.backendUrl}/${path}?from=${from.getTime()}&to=${to.getTime()}`;
  }

  private top(type: string, from: Date, to: Date): Observable<BazaarIdeaStatRow[]> {
    const url = this.withFromToQuery(`bazaar_ideas/stats/top/${type}`, from, to);
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  public topEvent(from: Date, to: Date): Observable<BazaarIdeaStatRow[]> {
    return this.top('event', from, to);
  }

  public topTeach(from: Date, to: Date): Observable<BazaarIdeaStatRow[]> {
    return this.top('teach', from, to);
  }

  public topResearch(from: Date, to: Date): Observable<BazaarIdeaStatRow[]> {
    return this.top('research', from, to);
  }

  public topCreators(from: Date, to: Date): Observable<BazaarTopCreator[]> {
    const url = this.withFromToQuery('bazaar_ideas/stats/creators', from, to);
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  public topEver(): Observable<BazaarIdeaStatRow[]> {
    const url = `${this.backendUrl}/bazaar_ideas/stats/ever`;
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

}
