import {Component, EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {ActivityResearchSlim, ActivitySlim, ActivityTeachEventSlim, ModalsService} from "@sos/sos-ui-shared";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminActivitiesService} from "./admin-activities.service";
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skip';
import {Subscription} from "rxjs/Subscription";
import {SearchSkill} from "../skills-tag-editor.component";
import {changeSorting, sortEntities, Sorting} from "../tables";


interface AdminActivitySlim extends ActivitySlim {
  startDate?: Date
  typeChar: string
  skillIds: Set<number>
  ownerName?: string
  daysActive?: number
  deadlineDate?: Date
  successClass: boolean
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

function setActivityPropsForUI(activity: ActivitySlim): AdminActivitySlim {
  const adminActivity = activity as AdminActivitySlim;
  adminActivity.startDate = activity['startDate'] || activity['startTime'];
  adminActivity.typeChar = activity.type.charAt(0).toUpperCase();
  adminActivity.skillIds = getActivitySkills(activity);
  if (activity.type === 'research') {
    const { owner } = activity as ActivityResearchSlim;
    if (owner) {
      adminActivity.ownerName = `${owner.firstName} ${owner.lastName}`.toLowerCase();
    }
  }
  if (adminActivity.startDate) {
    adminActivity.daysActive = dateDiffInDays(activity.createdAt, adminActivity.startDate);
  }
  if (activity['deadline'])
    adminActivity.deadlineDate = activity['deadline'].date;
  adminActivity.successClass = activity.participantsCount >= activity.minParticipants;
  return adminActivity;
}

function getActivitySkills(activity: ActivitySlim): Set<number> {
  if (activity.type === 'research') {
    return new Set((activity as ActivityResearchSlim).skills.map(s => s.id));
  } else {
    const req = (activity as ActivityTeachEventSlim).requiredSkills.map(s => s.id);
    const acq = (activity as ActivityTeachEventSlim).acquiredSkills.map(s => s.id);
    return new Set(req.concat(acq));
  }
}


@Component({
  selector: 'sos-admin-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  private activities: AdminActivitySlim[];
  public filtered: AdminActivitySlim[];

  public sorting: Sorting = { prop: 'createdAt', display: 'data creazione', direction: 'desc' };
  public filtering: { search: string, skills: SearchSkill[] } = { search: null, skills: [] };

  private paramMapSub: Subscription;
  private languageSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private modalsService: ModalsService,
              private activitiesService: AdminActivitiesService) {}

  private setActivities(activities: ActivitySlim[]) {
    this.activities = activities.map(setActivityPropsForUI);
    this.filtered = sortEntities([...this.activities], this.sorting);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { activities: ActivitySlim[] }) => {
      this.setActivities(data.activities);
    });

    // skip the first change as it's handled by the resolver
    this.paramMapSub = this.route.queryParamMap.skip(1).flatMap(paramMap => {
      const lang = paramMap.get('lang');
      if (lang)
        return this.activitiesService.all(lang);
      return Promise.resolve(null);
    }).subscribe(activities => {
      if (!activities) return;
      this.setActivities(activities);
    });
  }

  ngOnDestroy(): void {
    if (this.languageSub)
      this.languageSub.unsubscribe();
    if (this.paramMapSub)
      this.paramMapSub.unsubscribe();
  }

  changeSorting(prop: string, display: string) {
    this.sorting = changeSorting(prop, display, this.sorting);
    this.filtered = sortEntities(this.filtered, this.sorting);
  }

  private activityGuestsTeamMatchesSearch(activity: AdminActivitySlim): boolean {
    if (activity.ownerName) {
      return activity.ownerName.indexOf(this.filtering.search) !== -1;
    } else {
      return false;
    }
  }

  private activityMatchesSearch(activity: AdminActivitySlim): boolean {
    const { search } = this.filtering;
    if (!search) return true;
    return (activity.title.toLowerCase().indexOf(search) !== -1) &&
      this.activityGuestsTeamMatchesSearch(activity);
  }

  private activityMatchesSkills(activity: AdminActivitySlim): boolean {
    for (let i = 0; i < this.filtering.skills.length; i++) {
      const searchSkill = this.filtering.skills[i];
      if (!activity.skillIds.has(searchSkill.id))
        return false;
    }
    return true;
  }

  changeFilter() {
    if (this.filtering.search)
      this.filtering.search = this.filtering.search.toLowerCase();

    const filtered = this.activities.filter(activity => {
      return this.activityMatchesSkills(activity) && this.activityMatchesSearch(activity);
    });

    this.filtered = sortEntities(filtered, this.sorting);
  }

  openActivity(activity: AdminActivitySlim) {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/activities', activity.type, activity.id, 'edit'], {
      queryParamsHandling: 'preserve'
    });
  }

  deleteActivity(evt: Event, activity: AdminActivitySlim, idx: number) {
    evt.stopPropagation();

    const emitter = new EventEmitter<boolean>();
    emitter.first().subscribe(result => {
      if (result) {
        const obs = activity.type === 'teach' ?
          this.activitiesService.deleteTeach(activity.id) :
          activity.type === 'event' ?
            this.activitiesService.deleteEvent(activity.id) :
            this.activitiesService.deleteResearch(activity.id);

        obs.subscribe(() => {
          this.filtered.splice(idx, 1);
          const sourceIdx = this.activities.findIndex(a =>
            a.id === activity.id && a.type === activity.type);
          if (sourceIdx !== -1)
            this.activities.splice(sourceIdx, 1);
        });
      }
    });

    this.modalsService.show({
      title: 'Attenzione!',
      content: `
        <p>Una volta eliminata non sarà più possibile ripristinare l'attività.</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'Annulla',
      accept: 'Elimina',
      emitter: emitter
    });
  }

}
