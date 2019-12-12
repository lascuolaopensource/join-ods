import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityEditComponent} from "../activity.component";
import {ImageGalleriesService} from "../../image-galleries.service";
import {AdminActivitiesService} from "../../admin-activities.service";
import * as _ from "lodash";
import {AdminUsersService} from "../../../admin-users.service";
import {LanguageService} from "../../../language.service";
import {
  ActivityResearch,
  ActivityResearchRole,
  ActivityResearchTeam,
  BazaarResearch,
  DataImage,
  dateWithoutTimestamp,
  ModalsService,
  User,
} from '@sos/sos-ui-shared';


type RouteData = {
  bazaarIdea?: BazaarResearch,
  activity?: ActivityResearch
}

@Component({
  selector: 'sos-admin-research',
  templateUrl: './research.component.html',
  styleUrls: ['../edit.scss']
})
export class ActivityEditResearchComponent extends ActivityEditComponent {

  public activity: ActivityResearch;

  public startDateString: string;
  public foundUsers: User[];

  constructor(route: ActivatedRoute,
              router: Router,
              imageGalleriesService: ImageGalleriesService,
              languageService: LanguageService,
              modalsService: ModalsService,
              private activitiesService: AdminActivitiesService,
              private usersService: AdminUsersService) {
    super(route, router, imageGalleriesService, languageService, modalsService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.route.data.subscribe((data: RouteData) => {
      if (data.bazaarIdea) {
        let deadline = new Date(data.bazaarIdea.createdAt);
        deadline.setDate(deadline.getDate() + data.bazaarIdea.deadline);
        this.activity = {
          id: 0,
          language: this.selectedLanguage,
          type: 'research',
          title: data.bazaarIdea.title,
          coverPic: {} as DataImage,
          gallery: {
            id: 0,
            images: []
          },
          topics: data.bazaarIdea.topics,
          organizationName: data.bazaarIdea.organizationName,
          description: null,
          motivation: data.bazaarIdea.motivation,
          valueDetails: data.bazaarIdea.valueDetails,
          deadline: deadline,
          startDate: null,
          duration: data.bazaarIdea.duration,
          roles: data.bazaarIdea.positions.map(position => {
            return {
              id: 0,
              people: position.people,
              skills: position.skills
            }
          }),
          team: [],
          bazaarIdeaId: data.bazaarIdea.id
        };
        this.editing = false;
        this.submitTxt = 'Crea';
      } else {
        this.activity = data.activity;
        this.editing = true;
        this.submitTxt = 'Aggiorna';
      }

      this.fixDatesForForm();

      this.createdForLang[this.selectedLanguage] = this.editing;
    });
  }

  protected fixDatesForForm() {
    super.fixDatesForForm();
    if (this.activity.startDate) {
      // remove timezone and recreate date object from the new ISO date string
      this.startDateString = dateWithoutTimestamp(this.activity.startDate);
      this.activity.startDate = new Date(this.startDateString);
    }
  }

  setStartDate() {
    this.activity.startDate = new Date(this.startDateString);
  }

  protected updateActivityForLang(lang: string) {
    if (!this.activity)
      return;

    if (this.editing) {
      this.activitiesService.findResearch(this.activity.id, lang, []).subscribe(
        activity => {
          this.activity.language = activity.language;
          this.activity.title = activity.title;
          this.activity.motivation = activity.motivation;
          this.activity.valueDetails = activity.valueDetails;

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

  removeRole(idx: number) {
    let role = this.activity.roles[idx];
    if (role.id === 0) {
      this.activity.roles.splice(idx, 1);
    } else {
      role['delete'] = true;
    }
  }

  addRole() {
    if (!this.activity.roles)
      this.activity.roles = [];

    this.activity.roles.push({
      id: 0,
      people: null,
      skills: []
    });
  }

  searchUser(evt: Event, name: string) {
    evt.preventDefault();
    this.foundUsers = [];
    this.usersService.search(name).subscribe(users => {
      this.foundUsers = users;
    });
  }

  addTeam(idx?: number) {
    if (!this.activity.team)
      this.activity.team = [];

    if (idx == null) {
      this.activity.team.push({ id: 0 } as ActivityResearchTeam);
      return;
    }

    let u = this.foundUsers[idx];
    if (this.activity.team.find(t => !t['delete'] && t.userId != null && t.userId === u.id))
      return;

    this.activity.team.push({
      id: 0,
      userId: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      title: u.title
    });
  }

  removeTeam(idx: number) {
    if (this.activity.team[idx].id == 0) {
      this.activity.team.splice(idx, 1);
    } else {
      this.activity.team[idx]['delete'] = true;
    }
  }

  private roleWithNoSkills(): ActivityResearchRole|undefined {
    return this.activity.roles
      .find(role => role.skills.filter(s => !s['delete']).length < 1);
  }

  get hasInvalidData(): boolean {
    return (!this.activity.coverPic.extension && !this.activity.coverPic.data) ||
      this.activity.topics.length === 0 || this.activity.roles.length === 0 ||
      !!this.roleWithNoSkills();
  }

  protected actuallySaveActivity(): void {
    let gallery = _.cloneDeep(this.activity.gallery);
    this.activity.gallery.images = [];

    let activityJson: any = _.cloneDeep(this.activity);

    console.debug('sending', activityJson);

    this.sendingModel = true;
    const obs = this.editing ?
      this.activitiesService.updateResearch(activityJson) :
      this.activitiesService.createResearch(activityJson);

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
