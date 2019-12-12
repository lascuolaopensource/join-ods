import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AdminSkillsService, SkillAdmin} from "./admin-skills.service";
import {Observable} from "rxjs/Observable";


@Injectable()
export class SkillsResolver implements Resolve<SkillAdmin[]> {

  constructor(private skillsService: AdminSkillsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SkillAdmin[]> {
    return this.skillsService.searchAdmin();
  }

}
