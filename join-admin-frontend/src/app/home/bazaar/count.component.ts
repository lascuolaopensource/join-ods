import {Component, ViewEncapsulation} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AdminBazaarService, BazaarIdeaStatCount} from "../../bazaar/admin-bazaar.service";
import {PeriodSelectorService} from "../../period-selector.service";
import {flatMap, map} from "rxjs/operators";
import {HomeCardComponent} from "../home-card";


@Component({
  selector: 'sos-admin-home-bazaar-count',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <ng-container *ngIf="count$ | async as count; else loadingTpl">
      <div class="row home-card-row" *ngIf="!loading; else loadingTpl">
        <div [class]="colClass" *ngFor="let t of types">
          <div class="home-card">
            <div class="home-card-title">{{ t.title }}</div>
            <div class="home-card-numeric">
              {{ count[t.prop] | number }}
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
export class HomeBazaarCountComponent extends HomeCardComponent {

  public count$: Observable<BazaarIdeaStatCount>;
  public types = [
    {
      prop: 'total',
      title: 'Idee'
    }, {
      prop: 'teaching',
      title: 'Didattica'
    }, {
      prop: 'event',
      title: 'Eventi'
    }, {
      prop: 'research',
      title: 'Progetti'
    }
  ];
  public colClass: string;

  constructor(periodSelectorService: PeriodSelectorService,
              private bazaarService: AdminBazaarService) {
    super(periodSelectorService);
    this.colClass = 'col-' + Math.floor(12 / this.types.length);
  }

  ngOnInit(): void {
    this.count$ = this.period$.pipe(
      this.startLoading,
      flatMap(({ to }) => this.bazaarService.count(to)),
      map((count: BazaarIdeaStatCount) => {
        count.total = count.teaching + count.event + count.research;
        return count;
      }),
      this.doneLoading
    );
  }

}
