import {Component, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {AdminBazaarService, BazaarTopCreator} from "../../bazaar/admin-bazaar.service";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {Observable} from "rxjs/Observable";
import {flatMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-bazaar-creators',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Top 3 autori prolifici</div>
      <ng-container *ngIf="creators$ | async as creators; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let row of creators" class="home-card-list">
            <div>
              <a [routerLink]="['/users', row.id]" queryParamsHandling="preserve">
                {{ row.firstName }} {{ row.lastName }}</a> /
              <b>{{ row.ideasCount | number }}</b>
            </div>
            <div class="font-weight-bold">
              {{ row.average | number:'1.0-2' }}
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
export class HomeBazaarCreatorsComponent extends HomeCardComponent {

  public creators$: Observable<BazaarTopCreator[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private bazaarService: AdminBazaarService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.creators$ = this.period$.pipe(
      flatMap((period: Period) => {
        this.loading = true;
        return this.bazaarService.topCreators(period.from, period.to);
      }),
      this.doneLoading
    );
  }

}
