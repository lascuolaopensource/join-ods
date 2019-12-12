import {Period, PeriodSelectorService} from "../../period-selector.service";
import {flatMap} from "rxjs/operators";
import {ActivityProjectStatCount, AdminActivitiesService} from "../../activities/admin-activities.service";
import {Component, ViewEncapsulation} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HomeCardComponent} from "../home-card";


@Component({
  selector: 'sos-admin-home-activities-count-projects',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <ng-container *ngIf="count$ | async as count; else loadingTpl">
      <div class="row home-card-row" *ngIf="!loading; else loadingTpl">
        <div *ngFor="let box of boxes" class="col-4">
          <div class="home-card">
            <div class="home-card-title">{{ box.title }}</div>
            <div class="home-card-numeric">{{ count[box.prop] | number }}</div>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-template #loadingTpl>
      <div class="home-card">
        <div class="home-card-loader">
          <i class="sos-icon skull"></i>
          <div>Loading...</div>
        </div>
      </div>
    </ng-template>
  `
})
export class HomeActivitiesCountProjectsComponent extends HomeCardComponent {

  public count$: Observable<ActivityProjectStatCount>;
  public boxes = [
    { prop: 'ongoing', title: 'Ongoing' },
    { prop: 'ideas', title: 'Idee' },
    { prop: 'users', title: 'Utenti coinvolti' }
  ];

  constructor(periodSelectorService: PeriodSelectorService,
              private activitiesService: AdminActivitiesService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.count$ = this.period$.pipe(
      flatMap((period: Period) => {
        this.loading = true;
        return this.activitiesService.countProjects(period.from, period.to);
      }),
      this.doneLoading
    );
  }

}
