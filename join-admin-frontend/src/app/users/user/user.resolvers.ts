import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AdminBazaarService, BazaarIdeaMini} from "../../bazaar/admin-bazaar.service";
import {Observable} from "rxjs/Observable";
import {ActivityMini, AdminActivitiesService} from "../../activities/admin-activities.service";
import {FablabReservation} from "@sos/sos-ui-shared";
import {AdminFablabService} from "../../fablab/fablab.service";
import {AdminUser, AdminUsersService} from "../../admin-users.service";


function getId(route: ActivatedRouteSnapshot): number {
  return parseInt(route.paramMap.get('id'))
}


@Injectable()
export class AdminUserResolver implements Resolve<AdminUser> {

  constructor(private userService: AdminUsersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdminUser> | Promise<AdminUser> | AdminUser {
    return this.userService.find(getId(route));
  }

}


@Injectable()
export class UserIdeasResolver implements Resolve<BazaarIdeaMini[]> {

  constructor(private ideasService: AdminBazaarService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarIdeaMini[]> | Promise<BazaarIdeaMini[]> | BazaarIdeaMini[] {
    return this.ideasService.byUser(getId(route));
  }

}


@Injectable()
export class UserActivitiesResearchResolver implements Resolve<ActivityMini[]> {

  constructor(private activitiesService: AdminActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityMini[]> | Promise<ActivityMini[]> | ActivityMini[] {
    return this.activitiesService.researchByUser(getId(route), route.queryParamMap.get('lang'));
  }

}


@Injectable()
export class UserReservationsResolver implements Resolve<FablabReservation[]> {

  constructor(private fablabService: AdminFablabService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabReservation[]> | Promise<FablabReservation[]> | FablabReservation[] {
    return this.fablabService.otherUserReservations(getId(route), true);
  }

}
