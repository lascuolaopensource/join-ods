import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  audienceToString,
  BazaarTeach,
  fundingToString,
  levelToString,
  teachActivityTypeToString
} from "@sos/sos-ui-shared";
import {BazaarShowComponent} from "../abstract-bazaar-show.component";


@Component({
  selector: 'sos-admin-bazaar-show-teach',
  templateUrl: './teach.component.html',
  styleUrls: ['../bazaar-show.scss']
})
export class BazaarShowTeachComponent extends BazaarShowComponent implements OnInit {

  public idea: BazaarTeach;

  public activityType = teachActivityTypeToString;
  public audience = audienceToString;
  public level = levelToString;
  public funding = fundingToString;

  constructor(private route: ActivatedRoute, router: Router) {
    super(router);
  }

  ngOnInit() {
    this.route.data.subscribe((data: { idea: BazaarTeach }) => {
      this.idea = data.idea;
    });
  }

}
