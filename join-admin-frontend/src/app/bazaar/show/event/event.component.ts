import {Component, OnInit} from '@angular/core';
import {audienceToString, BazaarEvent, eventActivityTypeToString, fundingToString} from '@sos/sos-ui-shared';
import {ActivatedRoute, Router} from "@angular/router";
import {BazaarShowComponent} from "../abstract-bazaar-show.component";


@Component({
  selector: 'sos-admin-bazaar-show-event',
  templateUrl: './event.component.html',
  styleUrls: ['../bazaar-show.scss']
})
export class BazaarShowEventComponent extends BazaarShowComponent implements OnInit {

  public idea: BazaarEvent;

  public activityType = eventActivityTypeToString;
  public audience = audienceToString;
  public funding = fundingToString;

  constructor(private route: ActivatedRoute, router: Router) {
    super(router);
  }

  ngOnInit() {
    this.route.data.subscribe((data: { idea: BazaarEvent }) => {
      this.idea = data.idea;
    });
  }

}
