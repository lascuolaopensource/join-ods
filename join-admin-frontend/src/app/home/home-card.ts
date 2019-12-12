import {Period, PeriodSelectorService} from "../period-selector.service";
import {Observable} from "rxjs/Observable";
import {startWith, tap} from "rxjs/operators";
import {OnInit} from "@angular/core";


export abstract class HomeCardComponent implements OnInit {

  public loading: boolean = true;
  protected readonly startLoading = tap(() => this.loading = true);
  protected readonly doneLoading = tap(() => this.loading = false);

  protected constructor(protected periodSelectorService: PeriodSelectorService) {}

  abstract ngOnInit(): void

  get period$(): Observable<Period> {
    return this.periodSelectorService.period$.pipe(
      startWith(this.periodSelectorService.period)
    );
  }

}
