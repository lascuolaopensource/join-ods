import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BazaarResearch} from "@sos/sos-ui-shared";
import {BazaarShowComponent} from "../abstract-bazaar-show.component";


@Component({
  selector: 'sos-admin-bazaar-show-research',
  templateUrl: './research.component.html',
  styleUrls: ['../bazaar-show.scss']
})
export class BazaarShowResearchComponent extends BazaarShowComponent implements OnInit {

  public idea: BazaarResearch;
  public deadlineDate: Date;
  public endDate: Date;

  constructor(private route: ActivatedRoute, router: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { idea: BazaarResearch }) => {
      this.idea = data.idea;
      this.deadlineDate = new Date(this.idea.createdAt);
      this.deadlineDate.setDate(this.deadlineDate.getDate() + this.idea.deadline);
      this.endDate = new Date(this.deadlineDate);
      this.endDate.setDate(this.endDate.getDate() + this.idea.duration);
    });
  }

}
