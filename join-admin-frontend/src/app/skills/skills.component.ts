import {Component, EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {AdminSkillsService, SkillAdmin, SkillWithLinked} from "./admin-skills.service";
import {ActivatedRoute} from "@angular/router";
import {changeSorting, sortEntities, Sorting} from "../tables";
import {ModalsService, Skill} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";
import {debounceTime, distinctUntilChanged, filter, first, mergeMapTo, switchMap, takeWhile, tap} from "rxjs/operators";
import {identity} from "rxjs/util/identity";
import {UserShort} from "../activities/admin-activities.service";
import {Subject} from "rxjs/Subject";


declare const $: any;


interface SkillUI extends SkillAdmin {
  parentName?: string
  verifiedTxt: string
  showing?: Observable<SkillWithLinked>
  foundSkills?: Skill[]
  editable: {
    name: string
    parent?: { id: number, name: string }
  }
  saving?: boolean
}

function getVerifiedTxt(skill: SkillAdmin) {
  return skill.request ? 'non verificata' : 'verificata';
}

function makeForUI(skill: SkillAdmin): SkillUI {
  return {
    ...skill,
    parentName: skill.parent ? skill.parent.name : null,
    verifiedTxt: getVerifiedTxt(skill),
    editable: {
      name: skill.name,
      parent: skill.parent
    }
  };
}


@Component({
  selector: 'sos-admin-skills',
  styleUrls: ['./skills.component.scss'],
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit, OnDestroy {

  public skills: SkillUI[];

  public sorting: Sorting = { prop: 'id', display: 'id', direction: 'desc' };
  public filtering: { name: string, skill: string } = { name: null, skill: null };

  public parentDropdown$: { [id: number]: { search: Subject<string>, nav: Subject<number> } } = {};

  constructor(private route: ActivatedRoute,
              private skillsService: AdminSkillsService,
              private modalsService: ModalsService) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ skills }) => {
      this.skills = skills.map(makeForUI);
    });
  }

  ngOnDestroy(): void {
    for (const id in this.parentDropdown$) {
      if (this.parentDropdown$.hasOwnProperty(id)) {
        const { search, nav } = this.parentDropdown$[id];
        search.unsubscribe();
        nav.unsubscribe();
      }
    }
  }

  changeSorting(prop: string, display: string) {
    this.sorting = changeSorting(prop, display, this.sorting);
    this.skills = sortEntities(this.skills, this.sorting);
  }

  changeFilter() {
    const { name, skill } = this.filtering;
    this.skillsService.searchAdmin(skill, name).subscribe(skills => {
      this.skills = sortEntities(skills.map(makeForUI), this.sorting);
    });
  }

  openSkill(skill: SkillUI, idx: number) {
    if (skill.showing) {
      const { search, nav } = this.parentDropdown$[skill.id];
      search.unsubscribe();
      nav.unsubscribe();
      delete skill.showing;
    } else {
      skill.showing = this.skillsService.find(skill.id).pipe(
        tap<SkillWithLinked>(s => {
          skill.editable.name = s.name;
          skill.editable.parent = { ...skill.parent };
          skill.usersCount = s.users.length;
        })
      );

      const search = new Subject<string>();
      search.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((term: string) => term.length > 2),
        switchMap((term: string) => this.skillsService.search(term, true))
      ).subscribe(skills => {
        skill.foundSkills = skills.filter(s => s.id !== skill.id);
      });

      const nav = new Subject<number>();
      nav.subscribe(key => {
        const focused = $(`#skill-parent-${idx}-dropdown :focus`);
        switch (key) {
          case 40:  // arrow down
            focused.next().focus();
            break;
          case 38:  // arrow up
            focused.prev().focus();
            break;
          case 13:  // enter
            focused.click();
            break;
        }
      });

      this.parentDropdown$[skill.id] = { search, nav };
    }
  }

  private removeSkill(idx: number) {
    this.skills.splice(idx, 1);
  }

  deleteSkill(evt: Event, skill: SkillAdmin, idx: number) {
    evt.stopPropagation();

    if (skill.id === 0) {
      this.removeSkill(idx);
      return;
    }

    const emitter = new EventEmitter<boolean>();
    emitter.pipe(
      first(), takeWhile(identity),
      mergeMapTo(this.skillsService.deleteSkill(skill.id))
    ).subscribe(() => {
      this.removeSkill(idx);
    });

    let alert: string = null;
    if (skill.usersCount > 0) {
      if (skill.parent) {
        alert = `Eliminando la competenza, gli utenti ad essa collegati verranno 
                 spostati sulla skill genitore "${skill.parent.name}".`;
      } else {
        alert = 'Eliminando la competenza, gli utenti ad essa collegati perderanno la skill.';
      }
      alert = `<p>${alert}</p>`;
    }

    this.modalsService.show({
      emitter,
      title: 'Attenzione!',
      content: `
        <p>Sicuro di voler eliminare la competenza "${skill.name}"?</p>
        ${alert ? alert : ''}
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA'
    });
  }

  unlinkUser(skill: SkillUI, users: UserShort[], userIdx: number) {
    const user = users[userIdx];

    const emitter = new EventEmitter<boolean>();
    emitter.pipe(
      first(), takeWhile(identity),
      mergeMapTo(this.skillsService.deleteForUser(skill.id, user.id))
    ).subscribe(() => {
      users.splice(userIdx, 1);
      skill.usersCount--;
    });

    this.modalsService.show({
      emitter,
      title: 'Attenzione!',
      content: `
        <p>Sicuro di voler eliminare l'utente dalla competenza "${skill.name}"?</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA'
    });
  }

  confirmSkill(skill: SkillUI, confirm: boolean) {
    this.skillsService.confirm(skill.id, confirm).subscribe(() => {
      skill.request = !confirm;
      skill.verifiedTxt = getVerifiedTxt(skill);
    });
  }

  // noinspection JSMethodCanBeStatic
  setParent(skill: SkillUI, parent?: Skill) {
    if (parent) {
      skill.editable.parent = { id: parent.id, name: parent.name };
    } else {
      delete skill.editable.parent;
    }
  }

  saveSkill(skill: SkillUI) {
    if (skill.saving) return;
    skill.saving = true;
    const payload = new Skill(skill.id, skill.editable.name,
      skill.editable.parent ? skill.editable.parent.id : null);

    this.skillsService.update(payload).subscribe(
      s => {
        skill.saving = false;
        skill.name = s.name;
        if (s.path && s.parentId) {
          const foundParent = s.path.find(p => p.id === s.parentId);
          if (foundParent) {
            const { id, name } = foundParent;
            skill.parent = { id, name };
            skill.parentName = name;
          }
        } else {
          delete skill.parent;
          delete skill.parentName;
          delete skill.editable.parent;
        }
      },
      err => {
        console.error('failed to save skill\n', err);
        skill.saving = false;
      }
    );
  }

}
