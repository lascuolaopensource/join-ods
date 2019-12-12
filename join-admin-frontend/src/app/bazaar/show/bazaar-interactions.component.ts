import {Component, Input} from "@angular/core";
import {BazaarIdea} from "@sos/sos-ui-shared";


@Component({
  selector: 'sos-admin-bazaar-interactions',
  template: `
    <div class="interactions">
      <div>
        <span>{{ idea.counts.agrees }}</span>
        <i class="sos-icon agree"></i>
      </div>
      <div>
        <span>{{ idea.counts.wishes }}</span>
        <i class="sos-icon wish"></i>
      </div>
      <div>
        <span>{{ idea.counts.favorites }}</span>
        <i class="sos-icon favorite"></i>
      </div>
      <div>
        <span>{{ idea.counts.comments }}</span>
        <i class="sos-icon comment"></i>
      </div>
    </div>
  `,
  styleUrls: ['./bazaar-interactions.component.scss']
})
export class BazaarInteractionsComponent {

  @Input() idea: BazaarIdea;

}
