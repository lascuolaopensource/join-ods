import {Component, EventEmitter, OnInit} from "@angular/core";
import {BazaarComment, BazaarCommentsService, ModalsService} from "@sos/sos-ui-shared";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'sos-admin-bazaar-comments',
  template: `
    <div class="font-weight-bold my-3">Commenti:</div>
    <div *ngFor="let c of comments; index as idx; first as fst" class="row py-3" [class.dotted-border-top]="!fst">
      <div class="col-1 text-center">
        <button type="button" class="btn btn-link" (click)="deleteComment(c, idx)">
          <i class="sos-icon skull"></i>
        </button>
      </div>
      <div class="col-11">
        <div>
          <span class="font-weight-bold">{{ c.firstName }} {{ c.lastName }}</span>
          <span class="long-dash"></span>
          <span>{{ c.createdAt | date:'shortDate' }}</span>
          <span class="long-dash"></span>
          <span>{{ c.createdAt | date:'shortTime' }}</span>
        </div>
        <div>{{ c.comment }}</div>
      </div>
    </div>
  `
})
export class BazaarCommentsComponent implements OnInit {

  public comments: BazaarComment[];

  constructor(private route: ActivatedRoute,
              private bazaarCommentsService: BazaarCommentsService,
              private modalsService: ModalsService) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: { comments: BazaarComment[] }) => {
      this.comments = data.comments;
    });
  }

  deleteComment(comment: BazaarComment, idx: number) {
    const emitter = new EventEmitter<boolean>();
    this.modalsService.show({
      title: 'Attenzione!',
      content: `Sicuro di voler eliminare il commento di ${comment.firstName} ${comment.lastName}?`,
      close: 'ANNULLA',
      accept: 'ELIMINA',
      emitter
    });

    const subs = emitter.subscribe(result => {
      subs.unsubscribe();
      if (!result)
        return;

      this.bazaarCommentsService.destroy(comment.id).subscribe(() => {
        this.comments.splice(idx, 1);
      });
    });
  }

}
