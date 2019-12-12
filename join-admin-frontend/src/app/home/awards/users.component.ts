import {Component, Input, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {Observable} from "rxjs/Observable";
import {AdminUsersService, AwardType, UserStat} from "../../admin-users.service";
import {mergeMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-awards-users',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title d-flex justify-content-between">
        <div>Top 3 utenti</div>
        <div>{{ title }}</div>
      </div>
      <ng-container *ngIf="stats$ | async as stats; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let stat of stats" class="home-card-list">
            <div>
              <a [routerLink]="['/users', stat.id]" queryParamsHandling="preserve">
                {{ stat.firstName }} {{ stat.lastName }}</a>
            </div>
            <div class="font-weight-bold">
              {{ stat.quantity | number }}
              <span *ngIf="stat.trend"
                    [class.text-green]="stat.trend === 'up'"
                    [class.text-danger]="stat.trend === 'down'">
              <i class="sos-icon trend-{{ stat.trend }}"></i>
            </span>
            </div>
          </div>
          <div *ngIf="stats.length === 0">Nessun risultato...</div>
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
export class HomeAwardsUsersComponent extends HomeCardComponent {

  @Input()
  public title: string;
  @Input()
  private awardType: AwardType;

  public stats$: Observable<UserStat[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private userService: AdminUsersService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.stats$ = this.period$.pipe(
      mergeMap(({ from, to }: Period) => {
        this.loading = true;
        return this.userService.getStats(this.awardType, from, to);
      }),
      this.doneLoading
    );
  }

}
