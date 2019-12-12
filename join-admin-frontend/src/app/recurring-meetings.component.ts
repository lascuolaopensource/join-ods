import {Component, Input, ViewEncapsulation} from "@angular/core";
import {RecurringMeetings} from "@sos/sos-ui-shared";


@Component({
  selector: 'sos-admin-recurring-meetings-display',
  encapsulation: ViewEncapsulation.None,
  template: `
    <span *ngIf="meetings.days && meetings.hours && meetings.every && meetings.entity">
      {{ meetings.days }}
      <span *ngIf="meetings.days > 1">giorni</span>
      <span *ngIf="meetings.days === 1">giorno</span>
      {{ meetings.hours }}
      <span *ngIf="meetings.hours > 1">ore</span>
      <span *ngIf="meetings.hours === 1">ora</span>
      ogni
      <span *ngIf="meetings.every > 1">{{ meetings.every }}</span>
      <span *ngIf="meetings.entity == 0 && meetings.every > 1">settimane</span>
      <span *ngIf="meetings.entity == 0 && meetings.every === 1">settimana</span>
      <span *ngIf="meetings.entity == 1 && meetings.every > 1">mesi</span>
      <span *ngIf="meetings.entity == 1 && meetings.every === 1">mese</span>
      <span *ngIf="meetings.entity == 2 && meetings.every > 1">anni</span>
      <span *ngIf="meetings.entity == 2 && meetings.every === 1">anno</span>
    </span>
  `
})
export class RecurringMeetingsComponent {

  @Input() meetings: RecurringMeetings;

}
