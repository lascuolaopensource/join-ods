import {Component, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FablabMachine, ModalsService} from '@sos/sos-ui-shared';
import {AdminFablabService} from "../fablab.service";
import {first, mergeMapTo, takeWhile} from "rxjs/operators";
import {identity} from "rxjs/util/identity";
import {changeSorting, sortEntities, Sorting} from "../../tables";


interface FablabMachineUI extends FablabMachine {
  opened: boolean
  editing?: FablabMachine
  saving: boolean
}

function makeForUI(machine: FablabMachine): FablabMachineUI {
  return {
    ...machine,
    createdAt: new Date(machine['createdAt']),
    opened: false,
    saving: false
  };
}

@Component({
  selector: 'sos-admin-fablab-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class FablabMachinesComponent implements OnInit {

  public machines: FablabMachineUI[];
  public filtered: FablabMachineUI[];
  public newMachine: FablabMachineUI|null = null;

  public sorting: Sorting = { prop: 'createdAt', display: 'data di creazione', direction: 'desc' };
  public filtering: string = null;

  constructor(private route: ActivatedRoute,
              private fablabService: AdminFablabService,
              private modalsService: ModalsService) {}

  ngOnInit() {
    this.route.data.subscribe((data: { machines: FablabMachine[] }) => {
      this.machines = data.machines.map(makeForUI);
      this.filtered = [...this.machines];
    });
  }

  private getFiltered() {
    this.filtering = this.filtering.toLowerCase();
    return this.machines.filter(m => m.name.toLowerCase().indexOf(this.filtering) !== -1);
  }

  changeFilter() {
    const filtered = this.filtering ? this.getFiltered() : [...this.machines];
    this.filtered = sortEntities(filtered, this.sorting);
  }

  changeSorting(prop: string, display: string) {
    this.sorting = changeSorting(prop, display, this.sorting);
    this.filtered = sortEntities(this.filtered, this.sorting);
  }

  openNew() {
    if (this.newMachine) {
      this.newMachine = null;
    } else {
      this.newMachine = {
        id: 0,
        editing: {
          id: 0,
          cutsMetal: false,
          cutsNonMetal: false,
          engravesMetal: false,
          engravesNonMetal: false,
          operator: false,
          createdAt: new Date()
        },
        saving: false
      } as any;
    }
  }

  openMachine(idx: number) {
    const machine = this.filtered[idx];
    machine.opened = !machine.opened;
    if (!machine.opened) {
      delete machine.editing;
    }
  }

  toggleEditing(idx: number) {
    const machine = this.filtered[idx];
    if (machine.editing) {
      delete machine.editing;
    } else {
      machine.editing = { ...machine };
    }
  }

  toggleOperator(idx: number)
  toggleOperator(idx: number)
  toggleOperator(obj: number|FablabMachineUI) {
    const { editing } = typeof obj === 'number' ? this.filtered[obj] : obj;
    editing.operator = !editing.operator;
  }

  deleteMachine(evt: Event, idx: number) {
    event.stopPropagation();
    const machine = this.filtered[idx];

    const emitter = new EventEmitter<boolean>();
    emitter.pipe(
      first(), takeWhile(identity),
      mergeMapTo(this.fablabService.deleteMachine(machine.id))
    ).subscribe(() => {
      this.filtered.splice(idx, 1);
      const sourceIdx = this.machines.findIndex(m => m.id === machine.id);
      if (sourceIdx !== -1)
        this.machines.splice(sourceIdx, 1);
    });

    this.modalsService.show({
      emitter,
      title: 'Attenzione!',
      content: `
        <p>Una volta eliminata la macchina non sarà più possibile ripristinare i dati.</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA'
    });
  }

  machineIsInvalid(idx: number): boolean
  machineIsInvalid(machine: FablabMachineUI): boolean
  machineIsInvalid(obj: number|FablabMachineUI): boolean {
    const { editing } = typeof obj === 'number' ? this.filtered[obj] : obj;
    return !editing.name || editing.priceHour == undefined;
  }

  saveMachine(idx: number)
  saveMachine(machine: FablabMachineUI)
  saveMachine(obj: number|FablabMachineUI) {
    const machine = typeof obj === 'number' ? this.filtered[obj] : obj;
    const { editing } = machine;
    machine.saving = true;

    const obs = machine.id === 0 ?
      this.fablabService.createMachine(editing) :
      this.fablabService.updateMachine(editing);

    obs.subscribe(
      m => {
        const sourceIdx = this.machines.findIndex(ms => ms.id === m.id);
        if (sourceIdx !== -1) {
          this.machines.splice(sourceIdx, 1);
        }
        this.machines.push(makeForUI(m));
        this.changeFilter();
      },
      err => {
        console.error('failed to save machine\n', err);
        machine.saving = false;
      }
    );
  }

}
