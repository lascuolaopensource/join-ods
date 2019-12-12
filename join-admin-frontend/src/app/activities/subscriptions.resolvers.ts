import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AdminActivitiesService, AdminActivitySubscription} from "./admin-activities.service";
import {Observable} from "rxjs/Observable";


abstract class ActivitySubscriptionsResolver implements Resolve<AdminActivitySubscription[]> {

  protected abstract getObservable(id: number): Observable<AdminActivitySubscription[]>

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdminActivitySubscription[]> {
    return this.getObservable(parseInt(route.paramMap.get('id')))
  }
}

@Injectable()
export class ActivityEventSubscriptionsResolver extends ActivitySubscriptionsResolver {

  constructor(private activitiesService: AdminActivitiesService) {
    super();
  }

  protected getObservable(id: number): Observable<AdminActivitySubscription[]> {
    return this.activitiesService.subscriptionsEvent(id);
  }
}

@Injectable()
export class ActivityTeachSubscriptionsResolver extends ActivitySubscriptionsResolver {

  constructor(private activitiesService: AdminActivitiesService) {
    super();
  }

  protected getObservable(id: number): Observable<AdminActivitySubscription[]> {
    return this.activitiesService.subscriptionsTeach(id);
  }
}
