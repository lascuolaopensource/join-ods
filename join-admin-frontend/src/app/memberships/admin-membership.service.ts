import {Injectable} from "@angular/core";
import {
  AuthService,
  Environment,
  Membership,
  MembershipService,
  MembershipType,
  MembershipTypeSlim
} from "@sos/sos-ui-shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {UserShort} from "../activities/admin-activities.service";


export interface MembershipRequest {
  id: number
  membershipType: MembershipTypeSlim
  user: UserShort
  requestedAt: Date
}

export interface MembershipStatCount {
  membershipType: MembershipTypeSlim
  count: number
}


@Injectable()
export class AdminMembershipService extends MembershipService {

  constructor(http: Http, authService: AuthService, environment: Environment) {
    super(http, authService, environment);
  }

  public requests(lang?: string): Observable<MembershipRequest[]> {
    let url = `${this.backendUrl}/membership/requests`;
    if (lang)
      url += '?lang=' + lang;
    return this.http.get(url, this.options)
      .map(r => r.json().requests);
  }

  public acceptRequest(userId: number): Observable<Membership> {
    return this.http.put(`${this.backendUrl}/membership/${userId}`, {}, this.options)
      .map(response => {
        const json = response.json();
        return Membership.fromJson(json)
      });
  }

  public createType(type: MembershipType): Observable<MembershipType> {
    return this.http.post(`${this.backendUrl}/membership_types`, type, this.options)
      .map(r => r.json().type);
  }

  public updateType(type: MembershipType): Observable<MembershipType> {
    return this.http.put(`${this.backendUrl}/membership_types/${type.id}`, type, this.options)
      .map(r => r.json().type);
  }

  public deleteType(id: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/membership_types/${id}`, this.options).map(() => {});
  }

  public countActive(to: Date, lang?: string): Observable<MembershipStatCount[]> {
    let url = `${this.backendUrl}/membership/stats/count?to=${to.getTime()}`;
    if (lang)
      url += `&lang=${lang}`;
    return this.http.get(url, this.options)
      .map(r => r.json().stats);
  }

}
