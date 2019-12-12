import {BrowserModule} from "@angular/platform-browser";
import {LOCALE_ID, NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {AdminComponent} from "./admin.component";
import {Router, RouterModule, Routes} from "@angular/router";
import {UsersComponent} from "./users/users.component";
import {
  ActivitiesResolver,
  ActivitiesService,
  ActivityEventResolver,
  ActivityResearchAppsResolver,
  ActivityResearchResolver,
  ActivityTeachResolver,
  AfterDateValidatorDirective,
  AuthService,
  AuthServiceConfig,
  BazaarCommentsEventResolver,
  BazaarCommentsLearnResolver,
  BazaarCommentsResearchResolver,
  BazaarCommentsService,
  BazaarCommentsTeachResolver,
  BazaarEventResolver,
  BazaarIdeasResolver,
  BazaarIdeasService,
  BazaarIdeasSlimResolver,
  BazaarLearnResolver,
  BazaarResearchResolver,
  BazaarTeachResolver,
  CalendarService,
  Environment,
  ERROR_PAGE,
  FablabMachineReservationsResolver,
  FablabMachineResolver,
  FablabMachinesResolver,
  FablabService,
  HttpOAuth,
  LogoutComponent,
  MembershipService,
  MeUserResolver,
  MinValueDirective,
  ModalsComponent,
  ModalsService,
  TopicsService,
  UserResolver,
  UserService
} from "@sos/sos-ui-shared";
import {HeaderComponent} from "./header/header.component";
import {environment} from "../environments/environment";
import {UsersResolver} from "./users.resolver";
import {AdminUsersService} from "./admin-users.service";
import {UserComponent} from "./users/user/user.component";
import {AdminMembershipService} from "./memberships/admin-membership.service";
import {BazaarComponent} from "./bazaar/bazaar.component";
import {BazaarShowLearnComponent} from './bazaar/show/learn/learn.component';
import {BazaarShowTeachComponent} from './bazaar/show/teach/teach.component';
import {BazaarMeetingsDisplayComponent} from "./bazaar/show/meetings-display.component";
import {BazaarShowEventComponent} from "./bazaar/show/event/event.component";
import {BazaarCommentsComponent} from "./bazaar/show/comments.component";
import {AdminSkillsService} from "./skills/admin-skills.service";
import {AdminBazaarService} from "./bazaar/admin-bazaar.service";
import {BazaarDeleteComponent} from "./bazaar/bazaar-delete.component";
import {UserDeleteComponent} from "./users/user-delete.component";
import {BazaarShowResearchComponent} from "./bazaar/show/research/research.component";
import {AdminActivitiesService} from "./activities/admin-activities.service";
import {ActivitiesComponent} from "./activities/activities.component";
import {ActivityEditTeachEventComponent} from "./activities/edit/teach-event/teach-event.component";
import {PicUploadComponent} from "./activities/edit/pic-upload.component";
import {ActivityTopicsComponent} from "./activities/edit/topics/topics.component";
import {RecurringMeetingsComponent} from "./recurring-meetings.component";
import {ActivitySkillsComponent} from "./activities/edit/skills/skills.component";
import {ImageGalleriesService} from "./activities/image-galleries.service";
import {
  ActivityEventSubscriptionsResolver,
  ActivityTeachSubscriptionsResolver
} from "./activities/subscriptions.resolvers";
import {ActivitySubscriptionsComponent} from "./activities/subscriptions/activity-subscriptions.component";
import {ActivityEditResearchComponent} from './activities/edit/research/research.component';
import {ActivityApplicationsComponent} from './activities/applications/activity-applications.component';
import {FablabMachinesComponent} from './fablab/machines/machines.component';
import {AdminFablabService} from "./fablab/fablab.service";
import {FablabReservationsComponent} from './fablab/reservations/reservations.component';
import {FablabQuotationsComponent} from './fablab/quotations/quotations.component';
import {FablabQuotationsResolver} from "./fablab/quotations/quotations.resolver";
import {ErrorPageComponent} from "./error-page.component";
import {
  AdminUserResolver,
  UserActivitiesResearchResolver,
  UserIdeasResolver,
  UserReservationsResolver
} from "./users/user/user.resolvers";
import {LanguageService} from "./language.service";
import {BazaarBottomBarComponent} from "./bazaar/show/bazaar-bottom-bar.component";
import {BazaarInteractionsComponent} from "./bazaar/show/bazaar-interactions.component";
import {SkillsTagEditorComponent} from "./skills-tag-editor.component";
import {LoggedUserService} from "./logged-user.service";
import {HomeComponent} from "./home/home.component";
import {HomeBazaarLatestComponent} from "./home/bazaar/latest.component";
import {HomeBazaarCountComponent} from "./home/bazaar/count.component";
import {PeriodSelectorService} from "./period-selector.service";
import {HomeBazaarTopComponent} from "./home/bazaar/top.component";
import {HomeBazaarCreatorsComponent} from "./home/bazaar/creators.component";
import {HomeActivitiesCountComponent} from "./home/activities/count.component";
import {HomeActivitiesNextComponent} from "./home/activities/next.component";
import {HomeActivitiesTopComponent} from "./home/activities/top.component";
import {HomeFablabTopMachinesComponent} from "./home/fablab/top-machines.component";
import {HomeFablabCountComponent} from "./home/fablab/count.component";
import {HomeActivitiesTopProjectsComponent} from "./home/activities/top-projects.component";
import {HomeActivitiesCountProjectsComponent} from "./home/activities/count-projects.component";
import {RulesComponent} from "./rules/rules.component";
import {RulesService} from "./rules/rules.service";
import {MembershipsComponent} from "./memberships/memberships.component";
import {
  MembershipTypesEnProvider,
  MembershipTypesEnResolver,
  MembershipTypesItProvider,
  MembershipTypesItResolver
} from "./memberships/memberships.resolvers";
import {SkillsComponent} from "./skills/skills.component";
import {SkillsResolver} from "./skills/skills.resolver";
import {HomeAwardsUsersComponent} from "./home/awards/users.component";
import {HomeCommunityMembershipRequestsComponent} from "./home/community/membership-requests.component";
import {HomeCommunityMembershipCountComponent} from "./home/community/membership-count.component";
import {HomeCommunitySkillsLatestComponent} from "./home/community/latest-skills.component";
import {HomeCommunitySkillsTopComponent} from "./home/community/top-skills.component";
import {FablabNavigationComponent} from "./fablab/navigation.component";


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'users',
    component: UsersComponent,
    resolve: {
      users: UsersResolver
    }
  }, {
    path: 'users/:id',
    component: UserComponent,
    resolve: {
      user: AdminUserResolver,
      ideas: UserIdeasResolver,
      activities: UserActivitiesResearchResolver,
      reservations: UserReservationsResolver
    }
  },

  {
    path: 'bazaar',
    component: BazaarComponent,
    resolve: {
      bazaarIdeas: BazaarIdeasSlimResolver
    }
  }, {
    path: 'bazaar/learn/:id',
    component: BazaarShowLearnComponent,
    resolve: {
      idea: BazaarLearnResolver
    },
    children: [
      {
        path: 'comments',
        component: BazaarCommentsComponent,
        resolve: {
          comments: BazaarCommentsLearnResolver
        }
      }
    ]
  }, {
    path: 'bazaar/teach/:id',
    component: BazaarShowTeachComponent,
    resolve: {
      idea: BazaarTeachResolver
    },
    children: [
      {
        path: 'comments',
        component: BazaarCommentsComponent,
        resolve: {
          comments: BazaarCommentsTeachResolver
        }
      }
    ]
  }, {
    path: 'bazaar/event/:id',
    component: BazaarShowEventComponent,
    resolve: {
      idea: BazaarEventResolver
    },
    children: [
      {
        path: 'comments',
        component: BazaarCommentsComponent,
        resolve: {
          comments: BazaarCommentsEventResolver
        }
      }
    ]
  }, {
    path: 'bazaar/research/:id',
    component: BazaarShowResearchComponent,
    resolve: {
      idea: BazaarResearchResolver
    },
    children: [
      {
        path: 'comments',
        component: BazaarCommentsComponent,
        resolve: {
          comments: BazaarCommentsResearchResolver
        }
      }
    ]
  },

  {
    path: 'skills',
    component: SkillsComponent,
    resolve: {
      skills: SkillsResolver
    }
  },

  {
    path: 'activities',
    component: ActivitiesComponent,
    resolve: {
      activities: ActivitiesResolver
    }
  }, {
    path: 'activities/new/event/:id',
    component: ActivityEditTeachEventComponent,
    data: { activityType: 'event' },
    resolve: {
      bazaarIdea: BazaarEventResolver
    }
  }, {
    path: 'activities/new/teach/:id',
    component: ActivityEditTeachEventComponent,
    data: { activityType: 'teach' },
    resolve: {
      bazaarIdea: BazaarTeachResolver
    }
  }, {
    path: 'activities/new/learn/:id',
    component: ActivityEditTeachEventComponent,
    data: { activityType: 'teach' },
    resolve: {
      bazaarIdea: BazaarLearnResolver
    }
  }, {
    path: 'activities/new/research/:id',
    component: ActivityEditResearchComponent,
    resolve: {
      bazaarIdea: BazaarResearchResolver
    }
  }, {
    path: 'activities/event/:id/edit',
    component: ActivityEditTeachEventComponent,
    data: { activityType: 'event' },
    resolve: {
      activity: ActivityEventResolver
    }
  }, {
    path: 'activities/teach/:id/edit',
    component: ActivityEditTeachEventComponent,
    data: { activityType: 'teach' },
    resolve: {
      activity: ActivityTeachResolver
    }
  }, {
    path: 'activities/research/:id/edit',
    component: ActivityEditResearchComponent,
    resolve: {
      activity: ActivityResearchResolver
    }
  }, {
    path: 'activities/event/:id/subscriptions',
    component: ActivitySubscriptionsComponent,
    resolve: {
      subscriptions: ActivityEventSubscriptionsResolver,
      activity: ActivityEventResolver
    }
  }, {
    path: 'activities/teach/:id/subscriptions',
    component: ActivitySubscriptionsComponent,
    resolve: {
      subscriptions: ActivityTeachSubscriptionsResolver,
      activity: ActivityTeachResolver
    }
  }, {
    path: 'activities/research/:id/applications',
    component: ActivityApplicationsComponent,
    resolve: {
      roles: ActivityResearchAppsResolver
    }
  },

  {
    path: 'fablab',
    redirectTo: 'fablab/quotations'
  }, {
    path: 'fablab/machines',
    component: FablabMachinesComponent,
    resolve: {
      machines: FablabMachinesResolver
    }
  }, {
    path: 'fablab/reservations',
    component: FablabReservationsComponent
  }, {
    path: 'fablab/quotations',
    component: FablabQuotationsComponent,
    resolve: {
      quotations: FablabQuotationsResolver
    }
  },

  {
    path: 'memberships',
    component: MembershipsComponent,
    resolve: {
      it: MembershipTypesItResolver,
      en: MembershipTypesEnResolver
    }
  },

  {
    path: 'rules',
    component: RulesComponent
  },

  {
    path: 'error/:code',
    component: ErrorPageComponent
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'error/404'
  }
];


export function environmentFactory() {
  return new Environment(environment.production, environment.backendUrl, environment.rulesUrl);
}

export function authServiceConfigFactory() {
  return new AuthServiceConfig(environment.auth);
}

export function httpOAuthFactory(backend: XHRBackend, defaultOptions: RequestOptions,
                                 authService: AuthService, router: Router, errorRoute: string) {
  return new HttpOAuth(backend, defaultOptions, authService, router, errorRoute);
}


@NgModule({
  declarations: [
    AdminComponent,
    LogoutComponent,
    HomeComponent,
    HomeCommunityMembershipRequestsComponent, HomeCommunityMembershipCountComponent,
    HomeCommunitySkillsLatestComponent, HomeCommunitySkillsTopComponent,
    HomeBazaarLatestComponent, HomeBazaarCountComponent, HomeBazaarTopComponent, HomeBazaarCreatorsComponent,
    HomeActivitiesCountComponent, HomeActivitiesNextComponent, HomeActivitiesTopComponent,
    HomeActivitiesTopProjectsComponent, HomeActivitiesCountProjectsComponent,
    HomeFablabTopMachinesComponent, HomeFablabCountComponent,
    HomeAwardsUsersComponent,
    UsersComponent,
    HeaderComponent,
    UserComponent,
    BazaarComponent,
    BazaarMeetingsDisplayComponent,
    BazaarShowLearnComponent,
    BazaarShowTeachComponent,
    BazaarShowEventComponent,
    BazaarShowResearchComponent,
    BazaarCommentsComponent,
    BazaarBottomBarComponent,
    BazaarInteractionsComponent,
    ModalsComponent,
    SkillsComponent,
    BazaarDeleteComponent,
    UserDeleteComponent,
    ActivitiesComponent,
    PicUploadComponent,
    ActivityTopicsComponent,
    ActivityEditTeachEventComponent,
    ActivityEditResearchComponent,
    AfterDateValidatorDirective,
    MinValueDirective,
    RecurringMeetingsComponent,
    ActivitySkillsComponent,
    ActivitySubscriptionsComponent,
    ActivityApplicationsComponent,
    FablabMachinesComponent,
    FablabReservationsComponent,
    FablabQuotationsComponent,
    FablabNavigationComponent,
    ErrorPageComponent,
    SkillsTagEditorComponent,
    RulesComponent,
    MembershipsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'it' },
    { provide: ERROR_PAGE, useValue: '/error' },
    { provide: Http, deps: [XHRBackend, RequestOptions, AuthService, Router, ERROR_PAGE], useFactory: httpOAuthFactory },
    { provide: HttpOAuth, deps: [XHRBackend, RequestOptions, AuthService, Router, ERROR_PAGE], useFactory: httpOAuthFactory },
    { provide: Environment, useFactory: environmentFactory },
    { provide: AuthServiceConfig, useFactory: authServiceConfigFactory },
    AuthService,
    UserService, AdminUsersService,
    AdminUserResolver, UserResolver, MeUserResolver, UsersResolver,
    UserIdeasResolver, UserActivitiesResearchResolver, UserReservationsResolver,
    MembershipService, AdminMembershipService, MembershipTypesItProvider, MembershipTypesEnProvider,
    BazaarIdeasService, BazaarIdeasResolver, BazaarIdeasSlimResolver,
    BazaarLearnResolver, BazaarTeachResolver, BazaarEventResolver, BazaarResearchResolver,
    BazaarCommentsService,
    BazaarCommentsEventResolver, BazaarCommentsLearnResolver, BazaarCommentsTeachResolver, BazaarCommentsResearchResolver,
    ModalsService,
    AdminSkillsService, SkillsResolver,
    AdminBazaarService,
    TopicsService,
    ActivitiesService, AdminActivitiesService,
    ActivitiesResolver, ActivityEventResolver, ActivityTeachResolver,
    ActivityResearchResolver, ActivityResearchAppsResolver,
    ImageGalleriesService,
    ActivityEventSubscriptionsResolver, ActivityTeachSubscriptionsResolver,
    FablabService, AdminFablabService,
    FablabMachineResolver, FablabMachinesResolver, FablabMachineReservationsResolver,
    FablabQuotationsResolver,
    CalendarService,
    LanguageService,
    LoggedUserService,
    PeriodSelectorService,
    RulesService
  ],
  bootstrap: [ AdminComponent ]
})
export class AdminModule { }
