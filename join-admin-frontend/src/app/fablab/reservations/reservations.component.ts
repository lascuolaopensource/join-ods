import {Component, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CalendarService} from '@sos/sos-ui-shared';
import {ModalsService} from "@sos/sos-ui-shared/index";
import {AdminFablabService, FablabReservationFlat} from "../fablab.service";
import {changeSorting, sortEntities, Sorting} from "../../tables";
import {first, mergeMapTo, takeWhile} from "rxjs/operators";
import {identity} from "rxjs/util/identity";


interface FablabReservationFlatUI extends FablabReservationFlat {
  userName: string
  userTel: string
  date: Date
  hour: number
  machineName: string
}

function makeHours(): number[][] {
  const hs = [];
  let h = 0;
  for (let i = 0; i < 6; i++) {
    const row: (number|null)[] = [];
    for (let j = 0; j < 4; j++) {
      row.push(h);
      h++;
    }
    hs.push(row);
  }
  return hs;
}

@Component({
  selector: 'sos-admin-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class FablabReservationsComponent implements OnInit {

  public reservations: FablabReservationFlatUI[];
  public filtered: FablabReservationFlatUI[];

  public sorting: Sorting = { prop: 'date', display: 'data', direction: 'asc' };
  public filtering: { day: number|null, hour: number|null } = { day: null, hour: null };

  public readonly daysOfWeek = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
  public readonly monthStr = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio',
    'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  public readonly HOURS: number[][] = makeHours();

  public calendar: (number | '')[][];
  public firstDay: Date;
  public firstDayY: number;
  public firstDayM: number;

  public monthReservations: { [day: number]: boolean };

  constructor(private route: ActivatedRoute,
              private fablabService: AdminFablabService,
              private modalsService: ModalsService,
              private calendarService: CalendarService) {}

  ngOnInit() {
    this.firstDay = new Date();
    this.firstDay.setDate(1);
    this.firstDay.setHours(0, 0, 0, 0);
    this.monthReservations = {};
    this.updateCalendar();
  }

  private reservationMatchesDay(r: FablabReservationFlatUI): boolean {
    if (this.filtering.day === null) return true;
    return this.filtering.day === r.time.date.getDate();
  }

  private reservationMatchesHour(r: FablabReservationFlatUI): boolean {
    if (this.filtering.hour === null) return true;
    return this.filtering.hour === r.time.hour;
  }

  private changeFilter() {
    const filtered = this.reservations.filter(r => {
      return this.reservationMatchesDay(r) && this.reservationMatchesHour(r);
    });

    this.filtered = sortEntities(filtered, this.sorting);
  }

  changeSorting(prop: string, display: string) {
    this.sorting = changeSorting(prop, display, this.sorting);
    this.filtered = sortEntities(this.filtered, this.sorting);
  }

  private updateCalendar() {
    this.firstDayY = this.firstDay.getFullYear();
    this.firstDayM = this.firstDay.getMonth();
    this.calendar = this.calendarService.getCalendar(this.firstDayY, this.firstDayM);

    this.monthReservations = {};
    const to = new Date(this.firstDay);
    to.setMonth(to.getMonth() + 1);
    to.setDate(to.getDate() - 1);
    this.reservations = [];
    this.filtered = [];
    this.fablabService.reservationsByDate(this.firstDay, to).subscribe(reservations => {
      for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i];
        const { date, hour } = reservation.time;
        this.monthReservations[date.getDate()] = true;
        this.reservations.push({
          ...reservation, date, hour,
          userName: `${reservation.user.firstName} ${reservation.user.lastName}`,
          userTel: reservation.user.telephone,
          machineName: reservation.machine.name
        });
      }
      this.changeFilter();
    });
  }

  nextMonth() {
    this.firstDay.setMonth(this.firstDay.getMonth() + 1);
    this.filtering = { day: null, hour: null };
    this.updateCalendar();
  }

  prevMonth() {
    this.firstDay.setMonth(this.firstDay.getMonth() - 1);
    this.filtering = { day: null, hour: null };
    this.updateCalendar();
  }

  selectDay(day: number | '') {
    if (day !== '') {
      if (this.filtering.day === day)
        this.filtering = { day: null, hour: null };
      else
        this.filtering.day = day;
      this.changeFilter();
    }
  }

  selectHour(hour: number) {
    if (this.filtering.hour === hour) {
      this.filtering.hour = null;
    } else {
      this.filtering.hour = hour;
    }
    this.changeFilter();
  }

  deleteReservation(idx: number) {
    const { id, machine, time } = this.filtered[idx];

    const emitter = new EventEmitter<boolean>();
    emitter.pipe(first(), takeWhile(identity),
      mergeMapTo(this.fablabService.deleteReservationTime(id, machine.id, time.date, time.hour))
    ).subscribe(() => {
      this.filtered.splice(idx, 1);
      const sourceIdx = this.reservations.findIndex(r =>
        r.id === id && r.machine.id === machine.id &&
        r.time.date === time.date && r.time.hour === time.hour);
      if (sourceIdx !== -1)
        this.reservations.splice(sourceIdx, 1);
    });

    this.modalsService.show({
      emitter,
      title: 'Attenzione!',
      content: `
        <p>Una volta eliminata non sarà più possibile ripristinare i dati.</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA'
    });
  }

}
