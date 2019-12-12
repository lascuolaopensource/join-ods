import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'sos-admin-error-page',
  template: `<h1>Error {{ code }}</h1>`
})
export class ErrorPageComponent implements OnInit {

  public code: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.code = parseInt(paramMap.get('code'));
    });
  }

}
