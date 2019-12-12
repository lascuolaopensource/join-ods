import {Component, ViewEncapsulation} from "@angular/core";
import {AdminBazaarService, BazaarIdeaStatRow} from "../../bazaar/admin-bazaar.service";
import {Observable} from "rxjs/Observable";
import {PeriodSelectorService} from "../../period-selector.service";
import {HomeCardComponent} from "../home-card";
import {flatMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-bazaar-latest',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Ultime 3 idee proposte</div>
      <ng-container *ngIf="latest$ | async as latest; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let row of latest" class="home-card-list">
            <div>
              <a [routerLink]="['/bazaar', row.ideaType, row.ideaId]" queryParamsHandling="preserve">
                {{ row.title }}</a> /
              <a class="font-weight-bold" [routerLink]="['/users', row.userId]" queryParamsHandling="preserve">
                {{ row.firstName }} {{ row.lastName }}</a>
            </div>
            <div class="font-weight-bold">{{ row.score | number:'1.0-2' }}</div>
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
export class HomeBazaarLatestComponent extends HomeCardComponent {

  public latest$: Observable<BazaarIdeaStatRow[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private bazaarService: AdminBazaarService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.latest$ = this.period$.pipe(
      flatMap(({ to }) => {
        this.loading = true;
        return this.bazaarService.latest(to);
      }),
      this.doneLoading
    );
  }

}
