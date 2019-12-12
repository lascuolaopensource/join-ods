import {Observable} from "rxjs/Observable";
import {Component, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {ActivityStat, AdminActivitiesService} from "../../activities/admin-activities.service";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {LanguageService} from "../../language.service";
import {flatMap, merge} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-activities-next',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Prossime 3 attività</div>
      <ng-container *ngIf="next$ | async as next; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let row of next" class="home-card-list">
            <div>
              <a [routerLink]="['/activities', row.activityClass, row.id, 'edit']"
                 queryParamsHandling="preserve">
                {{ row.title }} / <b>{{ row.ideasCount | number }}</b></a>
            </div>
            <div class="font-weight-bold">
              {{ row.startDate | date:'shortDate' }}
            </div>
          </div>
          <div *ngIf="next.length === 0">Nessun risultato...</div>
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
export class HomeActivitiesNextComponent extends HomeCardComponent {

  public next$: Observable<ActivityStat[]>;
  private period: Period;
  private language: string;

  constructor(periodSelectorService: PeriodSelectorService,
              private languageService: LanguageService,
              private activitiesService: AdminActivitiesService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.language = this.languageService.language;

    this.next$ = this.period$.pipe(
      merge(this.languageService.observable),
      flatMap((value: string | Period) => {
        if (typeof value === 'string') {
          this.language = value;
        } else {
          this.period = value;
        }
        this.loading = true;
        return this.activitiesService.next(this.period.to, this.language);
      }),
      this.doneLoading
    );
  }

}
