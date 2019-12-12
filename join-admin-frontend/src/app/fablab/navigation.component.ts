import {Component} from "@angular/core";


@Component({
  selector: 'sos-admin-fablab-navigation',
  styleUrls: ['./navigation.component.scss'],
  template: `
    <div id="fablab-navigation">
      <a routerLinkActive="active"
         routerLink="/fablab/quotations"
         queryParamsHandling="preserve"
         class="btn btn-link">Preventivi</a>
      <span>/</span>
      <a routerLinkActive="active"
         routerLink="/fablab/reservations"
         queryParamsHandling="preserve"
         class="btn btn-link">Prenotazioni</a>
      <span>/</span>
      <a routerLinkActive="active"
         routerLink="/fablab/machines"
         queryParamsHandling="preserve"
         class="btn btn-link">Macchine</a>
    </div>
  `
})
export class FablabNavigationComponent {}
