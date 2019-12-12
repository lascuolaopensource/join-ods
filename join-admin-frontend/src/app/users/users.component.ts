import {Component, EventEmitter, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from '@sos/sos-ui-shared';
import {changeSorting, sortEntities, Sorting} from "../tables";
import {AdminUser, AdminUsersService} from "../admin-users.service";
import {ModalsService} from "@sos/sos-ui-shared/index";
import {SearchSkill} from "../skills-tag-editor.component";
import 'rxjs/add/operator/first';
import {LoggedUserService} from "../logged-user.service";


@Component({
  selector: 'sos-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public user: User;
  public users: AdminUser[];
  public filtered: AdminUser[];

  public sorting: Sorting = { prop: 'createdAt', display: 'data creazione', direction: 'desc' };
  public filtering: { name: string, skills: SearchSkill[] } = { name: null, skills: [] };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: AdminUsersService,
              private modalsService: ModalsService,
              private loggedUserService: LoggedUserService) {}

  ngOnInit() {
    this.user = this.loggedUserService.user;

    this.route.data.subscribe((data: { users: AdminUser[] }) => {
      this.users = data.users;
      this.filtered = [...this.users];
    });
  }

  changeSorting(prop: string, display: string) {
    this.sorting = changeSorting(prop, display, this.sorting);

    if (this.sorting.prop === 'membership') {
      this.filtered = this.filtered.sort((a, b) => {
        if (a.memberships.request !== null && b.memberships.request !== null)
          return 0;
        else if (a.memberships.request !== null)
          return this.sorting.direction === 'asc' ? -1 : 1;
        else if (b.memberships.request !== null)
          return this.sorting.direction === 'asc' ? 1 : -1;
        else if (a.memberships.active !== null && b.memberships.active !== null)
          return 0;
        else if (a.memberships.active !== null)
          return this.sorting.direction === 'asc' ? -1 : 1;
        else if (b.memberships.active !== null)
          return this.sorting.direction === 'asc' ? 1 : -1;
        else
          return 0;
      });
    } else if (this.sorting)
      this.filtered = sortEntities(this.filtered, this.sorting);
  }

  private userMatchesName(user: AdminUser): boolean {
    if (!this.filtering.name) return true;
    const match = user.fullName.toLowerCase().indexOf(this.filtering.name);
    return match !== -1;
  }

  private userMatchesSkills(user: AdminUser): boolean {
    let userSkills = {};
    for (let i = 0; i < user.skills.length; i++) {
      userSkills[user.skills[i].skillId] = true;
    }
    for (let i = 0; i < this.filtering.skills.length; i++) {
      const searchSkill = this.filtering.skills[i];
      if (!userSkills[searchSkill.id])
        return false;
    }
    return true;
  }

  changeFilter() {
    if (this.filtering.name)
      this.filtering.name = this.filtering.name.toLowerCase();

    const f = this.users.filter(user =>
      this.userMatchesName(user) && this.userMatchesSkills(user));
    this.filtered = sortEntities(f, this.sorting);
  }

  openUser(userId: number) {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/users', userId], { queryParamsHandling: 'preserve' });
  }

  deletedUser(userId: number, idx: number) {
    this.filtered.splice(idx, 1);
    const sourceIdx = this.users.findIndex(u => u.id === userId);
    if (sourceIdx !== -1)
      this.users.splice(sourceIdx, 1);
  }

  toggleRole(event: Event, user: AdminUser) {
    event.stopPropagation();

    if (user.id === this.user.id)
      return;

    const admin = !user.isAdmin;
    const emitter = new EventEmitter<boolean>();
    emitter.first().subscribe(result => {
      if (!result)
        return;

      this.userService.updateRole(user.id, admin).subscribe(() => {
        user.isAdmin = admin;
      });
    });

    const partial = admin ?
      'Una volta reso admin questo utente avrà dei superpoteri.' :
      'Una volta revocati i permessi di admin questo utente non potrà accedere ad alcune sezioni di SOS.';

    this.modalsService.show({
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

}
