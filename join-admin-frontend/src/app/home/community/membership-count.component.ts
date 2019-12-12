import {Component, ViewEncapsulation} from "@angular/core";
import {AdminMembershipService, MembershipStatCount} from "../../memberships/admin-membership.service";
import {LanguageService} from "../../language.service";
import {Observable} from "rxjs/Observable";
import {HomeCardComponent} from "../home-card";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {flatMap, merge} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-community-membership-count',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <ng-container *ngIf="counts$ | async as counts; else loadingTpl">
      <div class="row home-card-row" *ngIf="!loading; else loadingTpl">
        <div class="col-4" *ngFor="let c of counts">
          <div class="home-card">
            <div class="home-card-title">{{ c.membershipType.name }}</div>
            <div class="home-card-numeric">{{ c.count | number }}</div>
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
export class HomeCommunityMembershipCountComponent extends HomeCardComponent {

  public counts$: Observable<MembershipStatCount[]>;
  private period: Period;
  private language: string;

  constructor(periodSelectorService: PeriodSelectorService,
              private languageService: LanguageService,
              private membershipService: AdminMembershipService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.language = this.languageService.language;

    this.counts$ = this.period$.pipe(
      merge(this.languageService.observable),
      flatMap((value: string | Period) => {
        if (typeof value === 'string') {
          this.language = value;
        } else {
          this.period = value;
        }
        this.loading = true;
        return this.membershipService.countActive(this.period.to, this.language);
      }),
      this.doneLoading
    );
  }

}
