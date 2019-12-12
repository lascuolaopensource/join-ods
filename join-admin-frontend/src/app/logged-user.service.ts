import {Injectable} from "@angular/core";
import {User} from "@sos/sos-ui-shared";
import {Subject} from "rxjs/Subject";


@Injectable()
export class LoggedUserService {

  // noinspection TypeScriptFieldCanBeMadeReadonly
  private _user: User;
  public user$: Subject<User>;

  constructor() {
    this.user$ = new Subject<User>();
    this.user$.subscribe(user => {
      this._user = user;
    });
  }

  get user(): User {
    return this._user;
  }

}
