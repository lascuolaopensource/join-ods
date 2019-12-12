import {Component, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {LanguageService} from "../../language.service";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {ActivityStat, AdminActivitiesService} from "../../activities/admin-activities.service";
import {Observable} from "rxjs/Observable";
import {merge, flatMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-activities-top',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Top 3 attività più partecipate</div>
      <ng-container *ngIf="top$ | async as top; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let row of top" class="home-card-list">
            <div>
              <a [routerLink]="['/activities', row.activityClass, row.id, 'edit']"
                 queryParamsHandling="preserve">{{ row.title }}</a>
            </div>
            <div class="font-weight-bold">
              {{ row.subCount | number }}
              <span *ngIf="row.trend"
                    [class.text-green]="row.trend === 'up'"
                    [class.text-danger]="row.trend === 'down'">
                <i class="sos-icon trend-{{ row.trend }}"></i>
              </span>
            </div>
          </div>
        </ng-container>
      </ng-container>
      <ng-template #loadingTpl>
        <div class="home-card-loader">
          <i class="sos-icon skull"></i>
          <div>Loading...</div>
        </div>
      </ng-template>
    </div>
  `
})
export class HomeActivitiesTopComponent extends HomeCardComponent {

  public top$: Observable<ActivityStat[]>;
  private period: Period;
  private language: string;

  constructor(periodSelectorService: PeriodSelectorService,
              private languageService: LanguageService,
              private activitiesService: AdminActivitiesService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.language = this.languageService.language;

    this.top$ = this.period$.pipe(
      merge(this.languageService.observable),
      flatMap((value: string | Period) => {
        if (typeof value === 'string') {
          this.language = value;
        } else {
          this.period = value;
        }
        this.loading = true;
        return this.activitiesService.top(this.period.from, this.period.to, this.language);
      }),
      this.doneLoading
    );
  }

}
