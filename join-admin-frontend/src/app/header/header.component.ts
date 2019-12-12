import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService, Language} from "@sos/sos-ui-shared";
import {NavigationStart, Router} from "@angular/router";
import {PeriodSelectorPreset, PeriodSelectorService} from "../period-selector.service";

declare const $: any;


const FONT_FEATS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function getDifferentRandom(prev: number, max: number): number {
  let i;
  do {
    i = Math.floor(Math.random() * max);
  } while (i === prev);
  return i;
}


@Component({
  selector: 'sos-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @Input() supportedLanguages: Language[];
  @Input() selectedLanguageId: number;

  @Output() onLangChanged = new EventEmitter<number>();

  logoutUrl: string;

  languageFullName = {
    'it': 'Italiano',
    'en': 'Inglese'
  };

  periodSelectorVisible = false;
  selectedPreset: PeriodSelectorPreset | 'custom';

  constructor(private authService: AuthService,
              private router: Router,
              private periodSelectorService: PeriodSelectorService) {
    this.logoutUrl = this.authService.logoutUrl;
  }

  ngOnInit(): void {
    const N_LETTERS = 'SOS'.length;
    let oldRandoms = [0, 0, 0];
    window.setInterval(() => {
      for (let i = 0; i < N_LETTERS; i++) {
        let r = getDifferentRandom(oldRandoms[i], FONT_FEATS.length);
        $(`.navbar-brand > span:nth-of-type(${i+1})`).attr('class', 'font-feat-' + FONT_FEATS[r]);
        oldRandoms[i] = r;
      }
    }, 300);

    this.periodSelectorService.visibility$.subscribe(visible => {
      this.periodSelectorVisible = visible;
    });

    this.periodSelectorService.period$.subscribe(period => {
      this.selectedPreset = period.preset || 'custom';
    });

    this.updatePeriodPreset('week');
  }

  ngAfterViewInit(): void {
    let elem = $('#main-navbar');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        elem.collapse('hide');
      }
    });

    elem.on('show.bs.collapse', () => {
      $('body').css('overflow', 'hidden');
    });
    elem.on('hidden.bs.collapse', () => {
      $('body').css('overflow', 'auto');
    });
  }

  get showLogin(): boolean {
    return this.authService.showLogin;
  }

  clickLogin(evt: Event) {
    evt.preventDefault();
    this.authService.showLoginEmitter.emit();
  }

  changeLanguage(languageId: number) {
    this.onLangChanged.emit(languageId);
  }

  doLogout(event: Event) {
    event.preventDefault();
    this.authService.removeToken();
    document.forms['logout-form'].submit();
  }

  updatePeriodPreset(preset: PeriodSelectorPreset) {
    const to = new Date();
    const from = new Date();
    let n: number;
    switch (preset) {
      case 'week':
        n = 7;
        break;
      case 'month':
        n = 30;
        break;
      case 'year':
        n = 365;
        break;
    }
    from.setDate(to.getDate() - n);
    this.updatePeriod(from, to, preset);
  }

  updatePeriodCustom(from: string, to: string) {
    if (!from || !to)
      return;
    this.updatePeriod(new Date(from), new Date(to));
  }

  updatePeriod(from: Date, to: Date, preset?: PeriodSelectorPreset) {
    this.periodSelectorService.period$.next({ from, to, preset });
  }

}
