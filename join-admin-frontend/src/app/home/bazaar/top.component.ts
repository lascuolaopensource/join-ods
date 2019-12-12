import {Component, Input, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {AdminBazaarService, BazaarIdeaStatRow} from "../../bazaar/admin-bazaar.service";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {IdeaType} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";
import {flatMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-bazaar-top',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Top 3 idee {{ ideaTypeTxt }}</div>
      <ng-container *ngIf="top$ | async as top; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let row of top" class="home-card-list">
            <div>
              <a [routerLink]="['/bazaar', row.ideaType, row.ideaId]" queryParamsHandling="preserve">
                {{ row.title }}</a> /
              <a class="font-weight-bold" [routerLink]="['/users', row.userId]" queryParamsHandling="preserve">
                {{ row.firstName }} {{ row.lastName }}</a>
            </div>
            <div class="font-weight-bold">
              {{ row.score | number:'1.0-2' }}
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
export class HomeBazaarTopComponent extends HomeCardComponent {

  @Input() private ideaType?: IdeaType;
  public ideaTypeTxt: string;
  public top$: Observable<BazaarIdeaStatRow[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private bazaarService: AdminBazaarService) {
    super(periodSelectorService);
  }

  private getTop$({ from, to }: Period): Observable<BazaarIdeaStatRow[]> {
    switch (this.ideaType) {
      case 'event':
        return this.bazaarService.topEvent(from, to);
      case 'teach':
        return this.bazaarService.topTeach(from, to);
      case 'research':
        return this.bazaarService.topResearch(from, to);
    }
  }

  ngOnInit(): void {
    switch (this.ideaType) {
      case 'event':
        this.ideaTypeTxt = 'eventi';
        break;
      case 'teach':
        this.ideaTypeTxt = 'didattica';
        break;
      case 'research':
        this.ideaTypeTxt = 'progetti';
        break;
      default:
        this.ideaTypeTxt = '(di sempre)';
    }

    this.top$ = this.ideaType ?
      this.period$.pipe(
        flatMap((period: Period) => {
          this.loading = true;
          return this.getTop$(period);
        }),
        this.doneLoading
      ) :
      this.bazaarService.topEver().pipe(this.doneLoading);
  }

}
