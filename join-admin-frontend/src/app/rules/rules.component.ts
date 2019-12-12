import {Component, OnInit} from "@angular/core";
import {RulesService} from "./rules.service";
import {Observable} from "rxjs/Observable";
import {map, merge, tap} from "rxjs/operators";
import {Subject} from "rxjs/Subject";


@Component({
  selector: 'sos-admin-rules',
  templateUrl: './rules.component.html'
})
export class RulesComponent implements OnInit {

  public rules$: Observable<string>;
  private rules: string;
  private updatedRules$ = new Subject<string>();
  public sending = false;

  constructor(private rulesService: RulesService) {}

  ngOnInit(): void {
    this.rules$ = this.rulesService.get().pipe(
      merge(this.updatedRules$),
      map(rules => rules || 'Nessun regolamento salvato'),
      tap<string>(rules => this.rules = rules)
    );
  }

  setRules(rules: string) {
    this.sending = true;
    this.rulesService.set(rules).subscribe(
      () => {
        this.updatedRules$.next(rules);
        this.sending = false;
      },
      err => {
        console.error('failed to set rules\n', err);
        this.updatedRules$.next(this.rules);
        this.sending = false;
      }
    );
  }

}
