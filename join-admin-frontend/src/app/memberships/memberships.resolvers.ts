import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {InjectionToken, Provider} from "@angular/core";
import {MembershipType} from "@sos/sos-ui-shared/src/shared";
import {AdminMembershipService} from "./admin-membership.service";


class MembershipsResolver implements Resolve<MembershipType[]> {

  constructor(private lang: string,
              private membershipService: AdminMembershipService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.membershipService.allTypes(this.lang);
  }

}

export const MembershipTypesItResolver = new InjectionToken('MembershipTypesItResolver');
export const MembershipTypesEnResolver = new InjectionToken('MembershipTypesEnResolver');

export function MembershipTypesItFactory(membershipService: AdminMembershipService) {
  return new MembershipsResolver('it', membershipService);
}

export function MembershipTypesEnFactory(membershipService: AdminMembershipService) {
  return new MembershipsResolver('en', membershipService);
}

export const MembershipTypesItProvider: Provider = {
  provide: MembershipTypesItResolver,
  useFactory: MembershipTypesItFactory,
  deps: [AdminMembershipService]
};

export const MembershipTypesEnProvider: Provider = {
  provide: MembershipTypesEnResolver,
  useFactory: MembershipTypesEnFactory,
  deps: [AdminMembershipService]
};
