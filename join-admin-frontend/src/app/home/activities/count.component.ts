import {Component, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {ActivityStatCount, AdminActivitiesService} from "../../activities/admin-activities.service";
import {Observable} from "rxjs/Observable";
import {flatMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-activities-count',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <ng-container *ngIf="count$ | async as count; else loadingTpl">
      <div class="row home-card-row" *ngIf="!loading; else loadingTpl">
        <div *ngFor="let box of boxes" [class]="box.col || 'col-3'">
          <div class="home-card">
            <div class="home-card-title">{{ box.title }}</div>
            <div class="home-card-numeric">
              <ng-container *ngIf="box.percentage; else notPercentage">
                {{ count[box.prop] | percent:'1.0-2' }}
              </ng-container>
              <ng-template #notPercentage>
                {{ count[box.prop] | number }}
              </ng-template>
            </div>
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
export class HomeActivitiesCountComponent extends HomeCardComponent {

  public count$: Observable<ActivityStatCount>;
  public boxes = [
    {
      prop: 'programmed',
      title: 'In prog.'
    }, {
      prop: 'teaching',
      title: 'Didattica'
    }, {
      prop: 'event',
      title: 'Eventi'
    }, {
      prop: 'research',
      title: 'Progetti'
    }, {
      prop: 'done',
      title: 'Svolte'
    }, {
      prop: 'ideasCount',
      title: 'Idee totali'
    }, {
      prop: 'success',
      title: '% successo',
      col: 'col-6',
      percentage: true
    }
  ];

  constructor(periodSelectorService: PeriodSelectorService,
              private activitiesService: AdminActivitiesService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.count$ = this.period$.pipe(
      flatMap((period: Period) => {
        this.loading = true;
        return this.activitiesService.count(period.to);
      }),
      this.doneLoading
    );
  }

}
