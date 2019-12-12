import {Component, OnInit} from '@angular/core';
import {BazaarLearn} from '@sos/sos-ui-shared';
import {ActivatedRoute, Router} from "@angular/router";
import {BazaarShowComponent} from "../abstract-bazaar-show.component";


@Component({
  selector: 'sos-admin-bazaar-show-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['../bazaar-show.scss']
})
export class BazaarShowLearnComponent extends BazaarShowComponent implements OnInit {

  public idea: BazaarLearn;

  constructor(private route: ActivatedRoute, router: Router) {
    super(router);
  }

  ngOnInit() {
    this.route.data.subscribe((data: { idea: BazaarLearn }) => {
      this.idea = data.idea;
    });
  }

}
