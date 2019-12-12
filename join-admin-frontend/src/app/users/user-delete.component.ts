import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AdminUsersService} from "../admin-users.service";
import {ModalsService} from "@sos/sos-ui-shared";
import 'rxjs/add/operator/first';


@Component({
  selector: 'sos-admin-user-delete',
  template: `
    <button type="button" role="button" class="btn btn-black w-100 h-100"
            (click)="deleteUser($event)" [disabled]="userId === loggedUserId">
      <i class="sos-icon skull"></i>
    </button>
  `
})
export class UserDeleteComponent {

  @Input() userId: number;
  @Input() loggedUserId: number;
  @Output() deletedUsed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private modalsService: ModalsService, private usersService: AdminUsersService) {}

  deleteUser(event: Event) {
    event.stopPropagation();

    if (this.userId === this.loggedUserId)
      return;

    const emitter = new EventEmitter<boolean>();
    emitter.first().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(this.userId).subscribe(() => {
          this.deletedUsed.emit();
        });
      }
    });

    this.modalsService.show({
      title: 'Attenzione!',
      content: `
        <p>Una volta eliminato non sarà più possibile ripristinare l\'utente e tutti i dati ad esso collegati.</p>
        <p class="bigger">Pensaci bene...</p>
      `,
      close: 'ANNULLA',
      accept: 'CANCELLA',
      emitter: emitter
    });
  }

}
