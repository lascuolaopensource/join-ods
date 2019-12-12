import {Component, EventEmitter, OnInit} from "@angular/core";
import {AdminMembershipService} from "./admin-membership.service";
import {ActivatedRoute} from "@angular/router";
import {MembershipType, ModalsService} from "@sos/sos-ui-shared";
import {Observable} from "rxjs/Observable";
import {first, takeWhile} from "rxjs/operators";
import {identity} from "rxjs/util/identity";


interface MembershipTypeT {
  language: string
  name: string
  offer: string
  bottom: string
  saved: boolean
}

interface EditableMembershipType {
  id: number
  price: number
  position: number
  createdAt: Date
  translations: { [lang: string]: MembershipTypeT }
}

function makeTranslation(type: MembershipType): MembershipTypeT {
  const { id, language, name, offer, bottom } = type;
  return { language, name, offer, bottom, saved: id !== 0 };
}

function makeEditable(source: MembershipType, ...others: MembershipType[]): EditableMembershipType {
  const translations = { [source.language]: makeTranslation(source) };
  for (let i = 0; i < others.length; i++) {
    const other = others[i];
    translations[other.language] = makeTranslation(other);
  }
  const { id, price, position, createdAt } = source;
  return { id, price, position, createdAt, translations };
}

function makeNewMembership(lang: string, from?: MembershipType): MembershipType {
  return { ...from, id: 0, language: lang };
}

function makeSendable(type: EditableMembershipType, lang: string): MembershipType {
  const { id, position, price, createdAt, translations } = type;
  const { name, offer, bottom, language } = translations[lang];
  return { id, language, name, offer, bottom, price, position, createdAt };
}


@Component({
  selector: 'sos-admin-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss']
})
export class MembershipsComponent implements OnInit {

  public types: EditableMembershipType[];

  constructor(private route: ActivatedRoute,
              private membershipService: AdminMembershipService,
              private modalsService: ModalsService) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ it, en }) => {
      this.types = it.map(t => makeEditable(t, makeNewMembership('en', t)));

      for (let i = 0; i < en.length; i++) {
        const found = this.types.find(o => o.id === en[i].id);
        if (found) {
          found.translations.en = makeTranslation(en[i]);
        } else {
          this.types.push(makeEditable(en[i], makeNewMembership('it', en[i])));
        }
      }
    });
  }

  private saveOne(type: EditableMembershipType, lang: string): Observable<MembershipType> {
    const sendable = makeSendable(type, lang);
    if (type.id === 0) {
      return this.membershipService.createType(sendable);
    } else {
      return this.membershipService.updateType(sendable);
    }
  }

  saveMembership(type: EditableMembershipType) {
    if (!type.createdAt)
      type.createdAt = new Date();
    this.saveOne(type, 'it').flatMap(saved => {
      type.id = saved.id;
      type.translations.it.saved = true;
      return this.saveOne(type, 'en');
    }).subscribe(() => {
      type.translations.en.saved = true;
    });
  }

  private removeType(idx: number) {
    this.types.splice(idx, 1)
  }

  deleteMembership(type: EditableMembershipType, idx: number) {
    if (type.id === 0) {
      this.removeType(idx);
      return;
    }

    const emitter = new EventEmitter<boolean>();
    emitter.pipe(first(), takeWhile(identity)).flatMap(() => {
      return this.membershipService.deleteType(type.id);
    }).subscribe(() => {
      this.removeType(idx);
    });

    this.modalsService.show({
      title: 'Attenzione!',
      content: `
        <p>Sicuro di voler eliminare la membership selezionata?</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA',
      emitter
    });
  }

  addMembership() {
    const newType: any = {
      id: 0,
      translations: {
        it: { language: 'it', saved: false },
        en: { language: 'en', saved: false }
      }
    };
    this.types.push(newType);
  }

}
