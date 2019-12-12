import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ActivityResearchRole} from '@sos/sos-ui-shared';


@Component({
  selector: 'sos-admin-activity-applications',
  templateUrl: './activity-applications.component.html',
  styles: [`
    .table-fixed th {
      width: 20%;
    }
  `]
})
export class ActivityApplicationsComponent implements OnInit {

  public roles: ActivityResearchRole[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: { roles: ActivityResearchRole[] }) => {
      this.roles = data.roles;
    });
  }

}
