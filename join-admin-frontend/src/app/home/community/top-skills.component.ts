import {Component, ViewEncapsulation} from "@angular/core";
import {AdminSkillsService, SkillTopStat} from "../../skills/admin-skills.service";
import {Observable} from "rxjs/Observable";
import {HomeCardComponent} from "../home-card";
import {Period, PeriodSelectorService} from "../../period-selector.service";
import {mergeMap} from "rxjs/operators";


@Component({
  selector: 'sos-admin-home-community-skills-top',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Le 3 skill più diffuse nella community</div>
      <ng-container *ngIf="skills$ | async as skills; else loadingTpl">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div *ngFor="let s of skills" class="home-card-list">
            <div class="font-weight-bold w-50">
              <span>{{ s.name }}</span>
            </div>
            <div class="font-weight-bold">
              {{ s.count | number }} <small>persone</small>
              <span [class.text-green]="s.trend === 'up'"
                    [class.text-danger]="s.trend === 'down'">
                <i class="sos-icon trend-{{ s.trend }}"></i>
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
export class HomeCommunitySkillsTopComponent extends HomeCardComponent {

  public skills$: Observable<SkillTopStat[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private skillsService: AdminSkillsService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.skills$ = this.period$.pipe(
      mergeMap((period: Period) => {
        this.loading = true;
        return this.skillsService.byUserCount(period.from, period.to);
      }),
      this.doneLoading
    );
  }

}
