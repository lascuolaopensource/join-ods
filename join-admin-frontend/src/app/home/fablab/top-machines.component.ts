import {Component, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {AdminFablabService, FablabMachineStat} from "../../fablab/fablab.service";
import {Observable} from "rxjs/Observable";
import {flatMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-fablab-top-machines',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Le 3 macchine più usate</div>
      <ng-container *ngIf="topMachines$ | async as machines; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let machine of machines" class="home-card-list">
            <div>{{ machine.name }}</div>
            <div class="font-weight-bold">
              {{ machine.usage | number }}
              <span *ngIf="machine.trend"
                    [class.text-green]="machine.trend === 'up'"
                    [class.text-danger]="machine.trend === 'down'">
              <i class="sos-icon trend-{{ machine.trend }}"></i>
            </span>
            </div>
          </div>
          <div *ngIf="machines.length === 0">Nessun risultato...</div>
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
export class HomeFablabTopMachinesComponent extends HomeCardComponent {

  public topMachines$: Observable<FablabMachineStat[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private fablabService: AdminFablabService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.topMachines$ = this.period$.pipe(
      flatMap((period: Period) => {
        this.loading = true;
        return this.fablabService.topMachinesByUsage(period.from, period.to);
      }),
      this.doneLoading
    );
  }

}
