import {Component, EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {FablabReservation, ModalsService, SlimMachine, User} from "@sos/sos-ui-shared";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminMembershipService} from "../../memberships/admin-membership.service";
import {BazaarIdeaMini} from "../../bazaar/admin-bazaar.service";
import {ActivityMini, AdminActivitiesService} from "../../activities/admin-activities.service";
import {LanguageService} from "../../language.service";
import {AdminUser, AdminUsersService} from "../../admin-users.service";
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skip';
import {Subscription} from "rxjs/Subscription";
import {LoggedUserService} from "../../logged-user.service";


type RouteData = {
  user: AdminUser
  ideas: BazaarIdeaMini[]
  activities: ActivityMini[]
  reservations: FablabReservation[]
}

interface Reservation {
  machine: SlimMachine
  date: Date
  hour: number
}

@Component({
  selector: 'sos-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  public loggedUser: User;
  public user: AdminUser;
  public ideas: BazaarIdeaMini[];
  public activities: ActivityMini[];
  public reservations: Reservation[];

  private queryParamMapSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private membershipService: AdminMembershipService,
              private languageService: LanguageService,
              private activitiesService: AdminActivitiesService,
              private userService: AdminUsersService,
              private modalService: ModalsService,
              private loggedUserService: LoggedUserService) {}

  ngOnInit() {
    this.loggedUser = this.loggedUserService.user;

    this.route.data.subscribe((data: RouteData) => {
      this.user = data.user;
      this.ideas = data.ideas;
      this.activities = data.activities;
      this.reservations = [];
      for (let i = 0; i < data.reservations.length; i++) {
        const r = data.reservations[i];
        for (let j = 0; j < r.times.length; j++) {
          const t = r.times[j];
          const date = new Date(t.date.getTime());
          date.setUTCHours(t.hour);
          this.reservations.push({
            machine: r.machine,
            date: date,
            hour: t.hour
          });
        }
      }
    });

    this.queryParamMapSub = this.route.queryParamMap.skip(1).flatMap(paramMap => {
      const lang = paramMap.get('lang');
      if (lang)
        return this.activitiesService.researchByUser(this.user.id, lang);
      return Promise.resolve(null);
    }).subscribe(activities => {
      if (!activities) return;
      this.activities = activities;
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamMapSub)
      this.queryParamMapSub.unsubscribe();
  }

  setUserRole(admin: boolean) {
    if (this.user.id === this.loggedUser.id)
      return;

    const emitter = new EventEmitter<boolean>();

    emitter.first().subscribe(result => {
      if (!result)
        return;
      this.userService.updateRole(this.user.id, admin).subscribe(() => {
        this.user.isAdmin = admin;
      });
    });

    const partial = admin ?
      'Una volta reso admin questo utente avrà dei superpoteri.' :
      'Una volta revocati i permessi di admin questo utente non potrà accedere ad alcune sezioni di SOS.';

    this.modalService.show({
      title: 'Attenzione!',
      content: `
        <p>${partial}</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'CONFERMA',
      emitter
    });
  }

  onClickDeleteUser() {
    if (this.user.id === this.loggedUser.id)
      return;

    const emitter = new EventEmitter<boolean>();
    emitter.first().subscribe(result => {
      if (result) {
        this.userService.deleteUser(this.user.id).subscribe(() => {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigateByUrl('/users');
        });
      }
    });

    this.modalService.show({
      title: 'Attenzione!',
      content: `
        <p>Una volta eliminato non sarà più possibile ripristinare l\'utente e tutti i dati ad esso collegati.</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'CANCELLA',
      emitter: emitter
    });
  }

  acceptRequest() {
    const isForRenewal = this.user.memberships.active !== null;
    this.membershipService.acceptRequest(this.user.id).subscribe(
      acceptedRequest => {
        if (isForRenewal)
          this.user.memberships.renewal = acceptedRequest;
        else
          this.user.memberships.active = acceptedRequest;
        this.user.memberships.request = null;
      }
    );
  }

}
