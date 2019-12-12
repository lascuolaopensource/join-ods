import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {User} from '@sos/sos-ui-shared';
import {AdminUsersService} from "./admin-users.service";


@Injectable()
export class UsersResolver implements Resolve<User[]> {

  constructor(private userService: AdminUsersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> {
    return this.userService.all();
  }

}
