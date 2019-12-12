import {Component, Input, ViewEncapsulation} from "@angular/core";
import {BazaarIdeaMeetingsType, RecurringMeetings} from "@sos/sos-ui-shared";


@Component({
  selector: 'sos-admin-bazaar-meetings-display',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div *ngIf="isRecurring">
      <sos-admin-recurring-meetings-display [meetings]="meetings"></sos-admin-recurring-meetings-display>
    </div>
    
    <div *ngIf="!isRecurring">
      <div *ngFor="let s of meetings.schedules">
        {{ s.numberDays }} giorni da {{ s.numberHours }} ore
      </div>
    </div>
  `
})
export class BazaarMeetingsDisplayComponent {

  @Input() meetings: BazaarIdeaMeetingsType;

  get isRecurring(): boolean {
    return this.meetings instanceof RecurringMeetings;
  }

}
