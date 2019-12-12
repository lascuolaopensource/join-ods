import {Component, EventEmitter, Input, Output} from "@angular/core";
import {BazaarIdea} from "@sos/sos-ui-shared";


@Component({
  selector: 'sos-admin-bazaar-bottom-bar',
  template: `
    <div class="row bottom-bar">
      <div class="col-12 col-md-4">
        <a routerLink="comments" class="btn btn-link" *ngIf="!showingComments">
          <i class="sos-icon comment"></i> Vedi i commenti
        </a>
        <a [routerLink]="['/bazaar', idea.ideaType, idea.id]" queryParamsHandling="preserve"
           class="btn btn-link" *ngIf="showingComments">
          <i class="sos-icon comment"></i> Nascondi i commenti
        </a>
      </div>
      <div class="col-12 col-md-4">
        <a [routerLink]="activityLink" queryParamsHandling="preserve" class="btn btn-link"
           [class.disabled]="idea.activityId != null">Attiva</a>
      </div>
      <div class="col-12 col-md-4">
        <sos-admin-bazaar-delete [idea]="idea" (ideaDeleted)="deletedIdea()"
                                 cssClass="btn btn-link text-danger"
                                 innerHTML="<i class='sos-icon skull'></i> Cancella idea"></sos-admin-bazaar-delete>
      </div>
    </div>
  `
})
export class BazaarBottomBarComponent {

  @Input() idea: BazaarIdea;
  @Input() showingComments: boolean;
  @Output() onIdeaDelete = new EventEmitter<void>();

  deletedIdea() {
    this.onIdeaDelete.emit();
  }

  get activityLink() {
    return this.idea.activityId == null ?
      ['/activities/new', this.idea.ideaType, this.idea.id] :
      ['/activities', this.idea.ideaType === 'learn' ? 'teach' : this.idea.ideaType, this.idea.activityId, 'edit'];
  }

}
