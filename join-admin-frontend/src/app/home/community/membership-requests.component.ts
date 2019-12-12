import {Component, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {PeriodSelectorService} from "../../period-selector.service";
import {Observable} from "rxjs/Observable";
import {AdminMembershipService, MembershipRequest} from "../../memberships/admin-membership.service";
import {LanguageService} from "../../language.service";
import {flatMap, startWith} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-community-membership-requests',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">3 richieste di membership in sospeso</div>
      <ng-container *ngIf="requests$ | async as requests; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let m of requests" class="home-card-list">
            <div>
              <a [routerLink]="['/users', m.user.id]" queryParamsHandling="preserve">
                {{ m.user.firstName }} {{ m.user.lastName }}</a>
              /
              <span>{{ m.membershipType.name }}</span>
            </div>
          </div>
          <div *ngIf="requests.length < 1">Nessun risultato...</div>
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
export class HomeCommunityMembershipRequestsComponent extends HomeCardComponent {

  public requests$: Observable<MembershipRequest[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private languageService: LanguageService,
              private membershipService: AdminMembershipService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.requests$ = this.languageService.observable.pipe(
      startWith(this.languageService.language),
      flatMap((lang: string) => {
        this.loading = true;
        return this.membershipService.requests(lang);
      }),
      this.doneLoading
    );
  }

}
