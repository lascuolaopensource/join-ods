import {Injectable} from "@angular/core";
import {
  ActivitiesService,
  Activity,
  ActivityEvent,
  ActivityResearch,
  ActivitySubscription,
  ActivityTeach,
  ActivityType,
  UserShort
} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";
import {StatsTrend} from "../stats-shared";


export interface UserShort {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface AdminActivitySubscription {
  user: UserShort
  subscription: ActivitySubscription
}

export interface ActivityMini {
  id: number
  title: string
}

export interface ActivityStat {
  id: number
  title: string
  subCount: number
  startDate: Date
  activityClass: ActivityType,
  trend?: StatsTrend
}

export interface ActivityStatCount {
  programmed: number
  teaching: number
  event: number
  research: number
  ideasCount: number
  done: number
  success: number
}

export interface ActivityProjectStat {
  id: number,
  title: string
  subCount: number
  owner?: UserShort
  trend: StatsTrend
}

export interface ActivityProjectStatCount {
  ongoing: number
  ideas: number
  users: number
}


@Injectable()
export class AdminActivitiesService extends ActivitiesService {

  private create<T extends Activity>(activity: T, fromJson: (any) => T): Observable<T> {
    return this.http.post(`${this.backendUrl}/activities/${activity.type}`, activity, this.options)
      .map(response => {
        const json = response.json();
        return fromJson(json);
      });
  }

  public createEvent(activity: ActivityEvent): Observable<ActivityEvent> {
    return this.create(activity, ActivityEvent.fromJson);
  }

  public createTeach(activity: ActivityTeach): Observable<ActivityTeach> {
    return this.create(activity, ActivityTeach.fromJson);
  }

  public createResearch(activity: ActivityResearch): Observable<ActivityResearch> {
    return this.create(activity, ActivityResearch.fromJson);
  }


  private update<T extends Activity>(activity: T, fromJson: (any) => T): Observable<T> {
    return this.http.put(`${this.backendUrl}/activities/${activity.type}/${activity.id}`, activity, this.options)
      .map(response => {
        const json = response.json();
        return fromJson(json);
      });
  }

  public updateEvent(activity: ActivityEvent): Observable<ActivityEvent> {
    return this.update(activity, ActivityEvent.fromJson);
  }

  public updateTeach(activity: ActivityTeach): Observable<ActivityTeach> {
    return this.update(activity, ActivityTeach.fromJson);
  }

  public updateResearch(activity: ActivityResearch): Observable<ActivityResearch> {
    return this.update(activity, ActivityResearch.fromJson);
  }


  private deleteActivity(activityId: number, activityType: ActivityType): Observable<void> {
    return this.http.delete(`${this.backendUrl}/activities/${activityType}/${activityId}`, this.options)
      .map(() => {});
  }

  public deleteEvent(id: number): Observable<void> {
    return this.deleteActivity(id, 'event');
  }

  public deleteTeach(id: number): Observable<void> {
    return this.deleteActivity(id, 'teach');
  }

  public deleteResearch(id: number): Observable<void> {
    return this.deleteActivity(id, 'research');
  }

  private subscriptions(id: number, activityType: ActivityType): Observable<AdminActivitySubscription[]> {
    return this.http.get(`${this.backendUrl}/activities/${activityType}/${id}/subscriptions`, this.options)
      .map(response => response.json().subscriptions.map(s => {
        return {
          user: s.user,
          subscription: ActivitySubscription.fromJson(s.subscription)
        };
      }));
  }

  public subscriptionsEvent(id: number): Observable<AdminActivitySubscription[]> {
    return this.subscriptions(id, 'event');
  }

  public subscriptionsTeach(id: number): Observable<AdminActivitySubscription[]> {
    return this.subscriptions(id, 'teach');
  }

  private verifySubscription(
    id: number,
    userId: number,
    success: boolean,
    activityType: ActivityType
  ): Observable<AdminActivitySubscription>
  {
    return this.http
      .put(
        `${this.backendUrl}/activities/${activityType}/${id}/subscriptions/${userId}`,
        { success: success },
        this.options)
      .map(response => {
        const json = response.json();
        return {
          user: json.user,
          subscription: ActivitySubscription.fromJson(json.subscription)
        };
      });
  }

  public verifySubscriptionEvent(
    id: number,
    userId: number,
    success: boolean
  ): Observable<AdminActivitySubscription> {
    return this.verifySubscription(id, userId, success, 'event');
  }

  public verifySubscriptionTeach(
    id: number,
    userId: number,
    success: boolean
  ): Observable<AdminActivitySubscription> {
    return this.verifySubscription(id, userId, success, 'teach');
  }

  private deleteSubscription(id: number, userId: number, activityType: ActivityType): Observable<void> {
    return this.http.delete(`${this.backendUrl}/activities/${activityType}/${id}/subscriptions/${userId}`, this.options)
      .map(() => {});
  }

  public deleteSubscriptionEvent(id: number, userId: number): Observable<void> {
    return this.deleteSubscription(id, userId, 'event');
  }

  public deleteSubscriptionTeach(id: number, userId: number): Observable<void> {
    return this.deleteSubscription(id, userId, 'teach');
  }

  public researchByUser(userId: number, language?: string): Observable<ActivityMini[]> {
    let url = `${this.backendUrl}/activities/research/user/${userId}`;
    if (language)
      url += `?lang=${language}`;
    return this.http.get(url, this.options)
      .map(response => response.json().activities);
  }

  private makeStatUrl(path: string, qs: object): string {
    const ss = [];
    for (let prop in qs) {
      if (qs.hasOwnProperty(prop) && qs[prop] !== undefined) {
        const v = qs[prop];
        ss.push(`${prop}=${v instanceof Date ? v.getTime() : v}`);
      }
    }
    return `${this.backendUrl}/activities/stats/${path}?${ss.join('&')}`;
  }

  public next(from: Date, lang?: string): Observable<ActivityStat[]> {
    const url = this.makeStatUrl('next', { from, lang });
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  public top(from: Date, to: Date, lang?: string): Observable<ActivityStat[]> {
    const url = this.makeStatUrl('top', { from, to, lang });
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  public count(date: Date): Observable<ActivityStatCount> {
    const url = this.makeStatUrl('count', { date });
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  public topProjects(from: Date, to: Date, lang?: string): Observable<ActivityProjectStat[]> {
    const url = this.makeStatUrl('projects/top', { from, to, lang });
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

  public countProjects(from: Date, to: Date): Observable<ActivityProjectStatCount> {
    const url = this.makeStatUrl('projects/count', { from, to });
    return this.http.get(url, this.options)
      .map(response => response.json().stats);
  }

}
