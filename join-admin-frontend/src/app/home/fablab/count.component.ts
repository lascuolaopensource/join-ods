import {AdminFablabService, FablabStatCount} from "../../fablab/fablab.service";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {Observable} from "rxjs/Observable";
import {Component, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {flatMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-fablab-count',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <ng-container *ngIf="count$ | async as count; else loadingTpl">
      <div *ngIf="!loading; else loadingTpl" class="home-card-row row">
        <div class="col-4" *ngFor="let box of boxes">
          <div class="home-card">
            <div class="home-card-title">{{ box.title }}</div>
            <div class="home-card-numeric">{{ count[box.prop] | number }}</div>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-template #loadingTpl>
      <div class="home-card-loader">
        <i class="sos-icon skull"></i>
        <div>Loading...</div>
      </div>
    </ng-template>
  `
})
export class HomeFablabCountComponent extends HomeCardComponent {

  public count$: Observable<FablabStatCount>;
  public boxes = [
    {
      prop: 'quotations',
      title: 'Richieste'
    }, {
      prop: 'reservations',
      title: 'Prenotazioni'
    }, {
      prop: 'machines',
      title: 'Macchine'
    }
  ];

  constructor(periodSelectorService: PeriodSelectorService,
              private fablabService: AdminFablabService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.count$ = this.period$.pipe(
      flatMap((period: Period) => {
        this.loading = true;
        return this.fablabService.count(period.from, period.to);
      }),
      this.doneLoading
    );
  }

}
