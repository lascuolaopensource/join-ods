import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {FablabQuotation} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";
import {AdminFablabService} from "../fablab.service";


@Injectable()
export class FablabQuotationsResolver implements Resolve<FablabQuotation[]> {

  constructor(private fablabService: AdminFablabService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabQuotation[]> {
    return this.fablabService.allQuotations();
  }

}
