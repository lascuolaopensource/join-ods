import {Component, OnDestroy, OnInit} from "@angular/core";
import {PeriodSelectorService} from "../period-selector.service";
import {AwardType} from "../admin-users.service";


@Component({
  selector: 'sos-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public readonly awards: { award: AwardType, title: string }[][] = [
    [
      {
        award: 'teaching',
        title: 'Con più corsi'
      }, {
        award: 'research',
        title: 'Con più progetti'
      }
    ], [
      {
        award: 'ideas',
        title: 'Con più idee'
      }, {
        award: 'skills',
        title: 'Con più skills'
      }
    ], [
      {
        award: 'maker',
        title: 'Più maker (min. macchine)'
      }, {
        award: 'favored',
        title: 'Con più add ai preferiti'
      }
    ], [
      {
        award: 'favorites',
        title: 'Più attivo'
      }
    ]
  ];

  constructor(private periodSelectorService: PeriodSelectorService) {}

  ngOnInit(): void {
    this.periodSelectorService.show();
  }

  ngOnDestroy(): void {
    this.periodSelectorService.hide();
  }

}
