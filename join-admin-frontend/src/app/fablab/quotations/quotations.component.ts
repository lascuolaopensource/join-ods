import {Component, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FablabQuotation, ModalsService} from "@sos/sos-ui-shared";
import {AdminFablabService} from "../fablab.service";
import {changeSorting, sortEntities, Sorting} from "../../tables";
import {first, mergeMapTo, takeWhile} from "rxjs/operators";
import {identity} from "rxjs/util/identity";


interface FablabQuotationUI extends FablabQuotation {
  opened: boolean
  userName: string
  userEmail: string
  userTel?: string
  machinesCount: number
}

function makeForUI(q: FablabQuotation): FablabQuotationUI {
  const { user } = q;
  return {
    ...q,
    opened: false,
    userName: `${user.firstName} ${user.lastName}`,
    userEmail: user.email,
    userTel: user.telephone,
    machinesCount: q.machines.length
  };
}

function quotationMatchesName(name: string, quotation: FablabQuotationUI): boolean {
  if (!name) return true;
  return quotation.userName.toLowerCase().indexOf(name) !== -1;
}

function quotationMatchesMachine(machine: string, quotation: FablabQuotationUI): boolean {
  if (!machine) return true;
  const machinesLen = quotation.machines.length;
  if (machinesLen < 1) return false;
  for (let i = 0; i < machinesLen; i++) {
    if (quotation.machines[i].name.toLowerCase().indexOf(machine) !== -1)
      return true;
  }
  return false;
}


@Component({
  selector: 'sos-admin-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss']
})
export class FablabQuotationsComponent implements OnInit {

  private quotations: FablabQuotationUI[];
  public filtered: FablabQuotationUI[];

  public sorting: Sorting = { prop: 'createdAt', display: 'data di creazione', direction: 'desc' };
  public filtering: { name: string, machine: string } = { name: null, machine: null };

  constructor(private route: ActivatedRoute,
              private modalsService: ModalsService,
              private fablabService: AdminFablabService) {}

  ngOnInit() {
    this.route.data.subscribe((data: { quotations: FablabQuotation[] }) => {
      this.quotations = data.quotations.map(makeForUI);
      this.filtered = [...this.quotations];
    });
  }

  changeFilter() {
    let { name, machine } = this.filtering;
    if (name)
      name = name.toLowerCase();
    if (machine)
      machine = machine.toLowerCase();

    const filtered = this.quotations.filter(q =>
      quotationMatchesName(name, q) && quotationMatchesMachine(machine, q));
    this.filtered = sortEntities(filtered, this.sorting);
  }

  changeSorting(prop: string, display: string) {
    this.sorting = changeSorting(prop, display, this.sorting);
    this.filtered = sortEntities(this.filtered, this.sorting);
  }

  // noinspection JSMethodCanBeStatic
  openQuotation(q: FablabQuotationUI) {
    q.opened = !q.opened;
  }

  deleteQuotation(evt: Event, idx: number) {
    evt.stopPropagation();

    const id = this.filtered[idx].id;

    const emitter = new EventEmitter<boolean>();
    emitter.pipe(
      first(), takeWhile(identity),
      mergeMapTo(this.fablabService.deleteQuotation(id))
    ).subscribe(() => {
      this.filtered.splice(idx, 1);
      const sourceIdx = this.quotations.findIndex(q => q.id === id);
      if (sourceIdx)
        this.quotations.splice(sourceIdx, 1);
    });

    this.modalsService.show({
      emitter,
      title: 'Attenzione!',
      content: `
        <p>Una volta eliminato non sarà più possibile ripristinare i dati.</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA'
    });
  }

  updateUndertaken(evt: Event, quotation: FablabQuotationUI) {
    evt.stopPropagation();
    const newVal = !quotation.undertaken;
    this.fablabService.updateUndertakenQuotation(quotation.id, newVal).subscribe(() => {
      quotation.undertaken = newVal;
      const found = this.quotations.find(q => q.id === quotation.id);
      if (found) {
        found.undertaken = newVal;
      }
    });
  }

}
