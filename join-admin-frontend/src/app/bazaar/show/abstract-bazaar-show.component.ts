import {BazaarIdea} from "@sos/sos-ui-shared/src/shared";
import {Router} from "@angular/router";


export abstract class BazaarShowComponent {

  public idea: BazaarIdea;

  public showingComments: boolean;

  protected constructor(protected router: Router) {}

  onCommentsToggle(active: boolean) {
    this.showingComments = active;
  }

  deletedIdea() {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigateByUrl('/bazaar');
  }

}
