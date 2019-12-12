import {Injectable} from "@angular/core";
import {ApiService, AuthService, Environment, HttpOAuth} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";


@Injectable()
export class RulesService extends ApiService {

  constructor(protected http: HttpOAuth, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public get(): Observable<string | null> {
    return this.http.get(`${this.backendUrl}/rules`, this.options)
      .map(r => r.json().rules);
  }

  public set(rules: string): Observable<void> {
    return this.http.put(`${this.backendUrl}/rules`, { rules }, this.options).map(() => {});
  }

}
