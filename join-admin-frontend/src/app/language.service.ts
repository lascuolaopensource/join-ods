import {Injectable} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";


@Injectable()
export class LanguageService {

  private onLanguageChanged = new Subject<string>();
  private _language: string;

  constructor() {
    this.onLanguageChanged.subscribe(lang => {
      this.setLanguage(lang);
    });
  }

  private setLanguage(lang: string) {
    this._language = lang;
  }

  emitLanguage(lang: string) {
    this.onLanguageChanged.next(lang);
  }

  subscribe(cb: (string) => void): Subscription {
    return this.onLanguageChanged.subscribe(cb);
  }

  get observable(): Observable<string> {
    return this.onLanguageChanged.asObservable();
  }

  get language() {
    return this._language;
  }

}
