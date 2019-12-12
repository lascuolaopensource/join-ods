import {Component, EventEmitter, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Activity, ModalsService} from "@sos/sos-ui-shared";
import {AdminActivitiesService, AdminActivitySubscription} from "../admin-activities.service";


@Component({
  selector: 'sos-admin-activity-subscriptions',
  templateUrl: './activity-subscriptions.component.html'
})
export class ActivitySubscriptionsComponent implements OnInit {

  public activity: Activity;
  public subscriptions: AdminActivitySubscription[];

  constructor(private route: ActivatedRoute,
              private activitiesService: AdminActivitiesService,
              private modalsService: ModalsService) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: { activity: Activity, subscriptions: AdminActivitySubscription[] }) => {
      this.activity = data.activity;
      this.subscriptions = data.subscriptions;
    });
  }

  verifySubscription(userId: number, idx: number, success: boolean) {
    const obs = this.activity.type === 'teach' ?
      this.activitiesService.verifySubscriptionTeach(this.activity.id, userId, success) :
      this.activitiesService.verifySubscriptionEvent(this.activity.id, userId, success);

    obs.subscribe(adminSub => {
      this.subscriptions[idx] = adminSub;
    });
  }

  deleteSubscription(userId: number, idx: number) {
    const emitter = new EventEmitter<boolean>();
    emitter.subscribe(result => {
      if (result) {
        const obs = this.activity.type === 'teach' ?
          this.activitiesService.deleteSubscriptionTeach(this.activity.id, userId) :
          this.activitiesService.deleteSubscriptionEvent(this.activity.id, userId);

        obs.subscribe(() => {
          this.subscriptions.splice(idx, 1);
        });
      }
    });

    this.modalsService.show({
      title: 'Eliminare l\'iscrizione selezionata?',
      content: '<p>Una volta eliminata non sarà più possibile ripristinarla.</p>',
      close: 'Annulla',
      accept: 'Elimina',
      emitter: emitter
    });
  }

}
