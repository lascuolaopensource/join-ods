import {Component, EventEmitter, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
  ActivityEvent,
  ActivityGuest,
  ActivityTeach,
  ActivityType,
  Audience,
  audienceToString,
  BazaarEvent,
  BazaarLearn,
  BazaarTeach,
  DataImage,
  dateWithoutTimestamp,
  eventActivityTypeToString,
  FixedDaysMeetings,
  Image,
  levelToString,
  ModalsService,
  RecurringMeetings,
  SOSDate,
  teachActivityTypeToString,
  timeToString,
  User
} from "@sos/sos-ui-shared";
import * as _ from 'lodash';
import {AdminUser, AdminUsersService} from "../../../admin-users.service";
import {AdminActivitiesService} from "../../admin-activities.service";
import {ImageGalleriesService} from "../../image-galleries.service";
import {ActivityEditComponent} from "../activity.component";
import {LanguageService} from "../../../language.service";
import {Observable} from "rxjs/Observable";
import {debounceTime, distinctUntilChanged, filter, mergeMap, tap} from "rxjs/operators";


type RouteData = {
  activityType: ActivityType,
  bazaarIdea?: BazaarEvent | BazaarTeach | BazaarLearn,
  activity?: ActivityEvent | ActivityTeach
}


function fixDateForForm(zeroId: boolean, date: SOSDate & { dateString: string }): SOSDate {
  if (zeroId) date.id = 0;
  // remove timezone and recreate date object from the new ISO date string
  date.dateString = dateWithoutTimestamp(date.date);
  date.date = new Date(date.dateString);
  date.startTime = timeToString(parseInt(date.startTime));
  date.endTime = timeToString(parseInt(date.endTime));
  return date;
}


@Component({
  selector: 'sos-admin-activity-edit-teach-event',
  templateUrl: './teach-event.component.html',
  styleUrls: ['../edit.scss']
})
export class ActivityEditTeachEventComponent extends ActivityEditComponent implements OnDestroy {

  public bazaarIdea: BazaarEvent | BazaarTeach | BazaarLearn;
  public activity: ActivityEvent | ActivityTeach;
  public audienceArray: Array<{ selected: boolean, audience: Audience }>;
  public teachCategories = ['x', 'y', 'z'];
  public activityTypes;

  public searchingUser$: EventEmitter<string>;
  public foundUsers$: Observable<User[]>;
  public userProfiles: { [key: number]: User } = {};

  public startTimeStr: string;

  public guestsTxt: string;

  constructor(route: ActivatedRoute,
              router: Router,
              private usersService: AdminUsersService,
              private activitiesService: AdminActivitiesService,
              imageGalleriesService: ImageGalleriesService,
              languageService: LanguageService,
              modalsService: ModalsService) {
    super(route, router, imageGalleriesService, languageService, modalsService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.searchingUser$ = new EventEmitter<string>();
    this.foundUsers$ = this.searchingUser$.pipe(
      distinctUntilChanged(),
      filter<string>(s => s && s.length > 2),
      debounceTime(300),
      mergeMap((s: string) => this.usersService.search(s)),
      tap((users: User[]) => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          this.userProfiles[user.id] = user;
        }
      })
    );

    this.route.data.subscribe((data: RouteData) => {
      if (data.bazaarIdea) {
        this.bazaarIdea = data.bazaarIdea;

        this.activity = {
          id: 0,
          language: this.selectedLanguage,
          type: data.activityType,
          title: this.bazaarIdea.title,
          coverPic: {} as DataImage,
          gallery: {
            id: 0,
            images: [] as Image[]
          },
          topics: this.bazaarIdea.topics,
          description: null,
          deadline: null,
          bazaarIdeaId: this.bazaarIdea.id,
          level: this.bazaarIdea instanceof BazaarTeach ? this.bazaarIdea.level : null,
          audience: this.bazaarIdea instanceof BazaarLearn ? [] : this.bazaarIdea.audience,
          outputType: null,
          program: this.bazaarIdea instanceof BazaarLearn ? null : this.bazaarIdea.programDetails,
          activityType: this.bazaarIdea instanceof BazaarLearn ? null : this.bazaarIdea.activityType,
          costs: null,
          payments: false,
          minParticipants: null,
          maxParticipants: null,
          schedule: this.bazaarIdea instanceof BazaarLearn ? { totalHours: 0, totalDays: 0 }
            : this.bazaarIdea.isRecurring ?
              this.bazaarIdea.meetings as RecurringMeetings
              : (this.bazaarIdea.meetings as FixedDaysMeetings).schedules.reduce((acc, s) => {
                return {
                  totalDays: acc.totalDays + s.numberDays,
                  totalHours: acc.totalHours + (s.numberDays * s.numberHours)
                }
              }, { totalDays: 0, totalHours: 0 }),
          dates: this.bazaarIdea instanceof BazaarLearn ? [] : this.bazaarIdea.dates.map(d => fixDateForForm(true, d as any)),
          guests: ((this.bazaarIdea instanceof BazaarLearn || this.bazaarIdea instanceof BazaarTeach) ?
              this.bazaarIdea.teachers.concat(this.bazaarIdea.tutors)
              : this.bazaarIdea.guests
          ).map(guest => {
            guest.id = 0;
            return guest as ActivityGuest;
          }),
          requiredSkills: [],
          acquiredSkills: [],
        };

        if (this.activity.type === 'teach') {
          this.activity = _.merge(this.activity, {
            outputDescription: null,
            teachCategory: 'x'
          });
        }

        this.editing = false;
        this.submitTxt = 'Crea';
      } else {
        this.activity = data.activity;
        this.fixDatesForForm();
        this.editing = true;
        this.submitTxt = 'Aggiorna';
      }

      this.createdForLang[this.selectedLanguage] = this.editing;

      if (this.activity.type === 'teach') {
        this.activityTypes = this.enums.teachActivityTypes;
        this.guestsTxt = 'Docenti';
      } else {
        this.activityTypes = this.enums.eventActivityTypes;
        this.guestsTxt = 'Ospiti';
      }

      this.audienceArray = this.enums.enumerateEnum(this.enums.audienceTypes).map(audience => {
        const audienceInt = this.enums.audienceTypes[audience];
        return {
          selected: this.activity.audience.indexOf(audienceInt) !== -1,
          audience: audienceInt
        };
      });
    });
  }

  ngOnDestroy(): void {
    this.searchingUser$.complete();
  }

  protected updateActivityForLang(lang: string) {
    if (!this.activity)
      return;

    if (this.editing) {
      const obs = this.activity.type === 'teach' ?
        this.activitiesService.findTeach(this.activity.id, lang, []) :
        this.activitiesService.findEvent(this.activity.id, lang, []);

      obs.subscribe(
        activity => {
          this.activity.language = activity.language;
          this.activity.title = activity.title;
          this.activity.description = activity.description;
          this.activity.outputType = activity.outputType;
          this.activity.program = activity.program;

          const ownGuestIds = this.activity.guests.map(g => g.id);
          activity.guests.forEach(guest => {
            const idx = ownGuestIds.indexOf(guest.id);
            if (idx !== -1)
              this.activity.guests[idx] = guest;
            else
              this.activity.guests.push(guest);
          });

          this.createdForLang[lang] = true;
        },
        error => {
          this.createdForLang[lang] = false;
          if (error.status == 404) {
            this.activity.language = lang;
          } else {
            console.error(`failed to retrive activity for ${lang}\n`, error);
          }
        }
      );
    } else {
      this.activity.language = lang;
    }
  }

  get isRecurring(): boolean {
    return this.activity.schedule instanceof RecurringMeetings;
  }

  changeScheduleType(recurring: boolean) {
    if (recurring) {
      this.activity.schedule = new RecurringMeetings(0, 0, null, 0);
    } else {
      this.activity.schedule = {
        totalDays: 0,
        totalHours: 0
      };
    }
  }

  addDate() {
    this.activity.dates.push(new SOSDate(0, null, null, null));
  }

  removeDate(dateIdx: number) {
    let date = this.activity.dates[dateIdx];
    if (date.id === 0) {
      this.activity.dates.splice(dateIdx, 1);
    } else {
      date['delete'] = true;
    }
  }

  // noinspection JSMethodCanBeStatic
  fixDate(date: SOSDate & { dateString: string }) {
    date.date = new Date(date.dateString);
  }

  protected fixDatesForForm() {
    super.fixDatesForForm();
    this.activity.dates.forEach(d => fixDateForForm(false, d as any));
    if (this.activity.startTime) {
      const t = this.activity.startTime.getTime() - (this.activity.startTime.getTimezoneOffset() * 60 * 1000);
      this.startTimeStr = new Date(t).toISOString().slice(0, 16);
    }
  }

  removeGuest(guestIdx: number) {
    let guest = this.activity.guests[guestIdx];
    if (guest.id === 0) {
      this.activity.guests.splice(guestIdx, 1);
    } else {
      guest['delete'] = true;
    }
  }

  addGuest(user: User | string) {
    if (user instanceof User && this.activity.guests.filter(g => g.userId === user.id).length > 0)
      return;

    if (user instanceof User)
      this.userProfiles[user.id] = user;

    this.activity.guests.push(user instanceof User ? {
      id: 0,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      bio: user.bio
    } : {
      id: 0,
      userId: null,
      firstName: null,
      lastName: user,
      title: null,
      bio: null
    });
  }

  copyFromProfile(guest: ActivityGuest) {
    if (!guest.userId)
      return;

    const copyProfile = (profile: User) => {
      guest.firstName = profile.firstName;
      guest.lastName = profile.lastName;
      if (profile.title)
        guest.title = profile.title;
      if (profile.bio)
        guest.bio = profile.bio;
    };

    const updateProfiles = (user: User) => {
      this.userProfiles[user.id] = user;
      copyProfile(user);
    };

    const profile = this.userProfiles[guest.userId];
    if (!profile) {
      this.usersService.find(guest.userId).pipe(
        tap<AdminUser>(user => {
          this.userProfiles[user.id] = user;
        })
      ).subscribe(updateProfiles);
    } else {
      copyProfile(profile);
    }
  }

  get hasInvalidData(): boolean {
    return (!this.activity.coverPic.extension && !this.activity.coverPic.data) ||
      this.activity.topics.length === 0 || this.activity.dates.length === 0;
  }

  protected actuallySaveActivity(): void {
    let gallery = _.cloneDeep(this.activity.gallery);
    this.activity.gallery.images = [];

    let activityJson: any = _.cloneDeep(this.activity);

    activityJson.audience = this.audienceArray.filter(a => a.selected)
      .map(a => audienceToString(a.audience));

    activityJson.activityType = parseInt(activityJson.activityType);
    activityJson.activityType = this.activity.type === 'event' ?
      eventActivityTypeToString(activityJson.activityType)
      : teachActivityTypeToString(activityJson.activityType);


    if (activityJson.schedule instanceof RecurringMeetings)
      activityJson.schedule.entity = parseInt(activityJson.schedule.entity);
    activityJson.schedule = activityJson.schedule instanceof RecurringMeetings ?
      activityJson.schedule.asJson : _.merge(activityJson.schedule, { type: 'finite_days' });

    if (activityJson.level !== null)
      activityJson.level = levelToString(parseInt(activityJson.level));

    if (this.startTimeStr)
      activityJson.startTime = this.startTimeStr;

    console.debug('sending', activityJson);

    this.sendingModel = true;
    const obs = this.editing ?
      this.activity.type === 'event' ?
        this.activitiesService.updateEvent(activityJson) : this.activitiesService.updateTeach(activityJson)
      : this.activity.type === 'event' ?
        this.activitiesService.createEvent(activityJson) : this.activitiesService.createTeach(activityJson);

    obs.subscribe(
      activity => {
        this.activity = activity;
        this.fixDatesForForm();
        this.saveGalleryImages(gallery.images, activity.gallery.id);
      },
      error => {
        this.activity.gallery = gallery;
        console.error('failed to store activity', error);
        this.sendingModel = false;
      }
    );
  }

}
