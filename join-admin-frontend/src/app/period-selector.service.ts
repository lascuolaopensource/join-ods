import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";


export type PeriodSelectorPreset = 'week' | 'month' | 'year';

export interface Period {
  from: Date
  to: Date
  preset?: PeriodSelectorPreset
}

@Injectable()
export class PeriodSelectorService {

  public visibility$: Subject<boolean> = new Subject<boolean>();
  public period$: Subject<Period> = new Subject<Period>();

  // noinspection TypeScriptFieldCanBeMadeReadonly
  private _period: Period;

  constructor() {
    this.period$.subscribe(period => {
      this._period = period;
    });
  }

  get period(): Period {
    return this._period;
  }

  show() {
    this.visibility$.next(true);
  }

  hide() {
    this.visibility$.next(false);
  }

}
