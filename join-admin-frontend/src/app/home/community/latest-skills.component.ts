import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";
import {HomeCardComponent} from "../home-card";
import {PeriodSelectorService} from "../../period-selector.service";
import {AdminSkillsService, SkillSlim} from "../../skills/admin-skills.service";
import {Observable} from "rxjs/Observable";
import {ModalsService} from "@sos/sos-ui-shared";
import {first, mergeMapTo, takeWhile} from "rxjs/operators";
import {identity} from "rxjs/util/identity";


@Component({
  selector: 'sos-admin-home-community-skills-latest',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../home-card.scss'],
  template: `
    <div class="home-card">
      <div class="home-card-title">Ultime 6 skill inserite</div>
      <ng-container *ngIf="skills$ | async as skills; else loadingTpl">
        <ul class="list-inline mb-0" *ngIf="skills.length > 0; else noResult">
          <li class="list-inline-item mb-2" *ngFor="let s of skills">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text bg-yellow border-0">{{ s.name }}</div>
              </div>
              <button type="button" class="btn btn-yellow btn-sm" (click)="deleteSkill(s)">
                <i class="sos-icon skull"></i>
              </button>
            </div>
          </li>
        </ul>
        <ng-template #noResult>
          <div>Nessun risultato...</div>
        </ng-template>
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
export class HomeCommunitySkillsLatestComponent extends HomeCardComponent {

  public skills$: Observable<SkillSlim[]>;

  constructor(periodSelectorService: PeriodSelectorService,
              private skillsService: AdminSkillsService,
              private modalsService: ModalsService) {
    super(periodSelectorService);
  }

  ngOnInit(): void {
    this.skills$ = this.skillsService.latest();
  }

  deleteSkill(skill: SkillSlim) {
    const emitter = new EventEmitter<boolean>();
    emitter.pipe(
      first(), takeWhile(identity),
      mergeMapTo(this.skillsService.deleteSkill(skill.id))
    ).subscribe(() => {
      this.skills$ = this.skillsService.latest();
    });

    this.modalsService.show({
      emitter,
      title: 'Attenzione!',
      content: `
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA'
    });
  }

}
