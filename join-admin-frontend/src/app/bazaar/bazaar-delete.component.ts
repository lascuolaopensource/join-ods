import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AdminBazaarService} from "./admin-bazaar.service";
import {BazaarIdea, ModalsService} from "@sos/sos-ui-shared";
import 'rxjs/add/operator/first';


@Component({
  selector: 'sos-admin-bazaar-delete',
  template: `
    <button type="button" role="button" [ngClass]="cssClass"
            (click)="deleteIdea($event)" [innerHTML]="innerHTML">
    </button>
  `
})
export class BazaarDeleteComponent {

  @Input() idea: BazaarIdea;
  @Input() cssClass = 'btn btn-black w-100 h-100';
  @Input() innerHTML = `<i class="sos-icon skull"></i>`;
  @Output() ideaDeleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(private bazaarService: AdminBazaarService, private modalsService: ModalsService) {}

  deleteIdea(event: Event) {
    event.stopPropagation();

    const emitter = new EventEmitter<boolean>();
    emitter.first().subscribe(result => {
      if (result) {
        this.bazaarService.deleteIdea(this.idea.id, this.idea.ideaType).subscribe(() => {
          this.ideaDeleted.emit();
        });
      }
    });

    this.modalsService.show({
      title: 'Attenzione!',
      content: `
        <p>Una volta eliminata non sarà più possibile ripristinare l'idea.</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'ELIMINA',
      emitter: emitter
    });
  }

}
