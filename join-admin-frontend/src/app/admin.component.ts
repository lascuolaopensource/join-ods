import {Component, OnInit} from '@angular/core';
import {Language} from '@sos/sos-ui-shared';
import {LanguageService} from "./language.service";
import {AdminUsersService} from "./admin-users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoggedUserService} from "./logged-user.service";


@Component({
  selector: 'sos-admin-app',
  templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit {

  supportedLanguages = [
    new Language("en"),
    new Language("it")
  ];

  selectedLanguageId: number = 1;

  constructor(private languageService: LanguageService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: AdminUsersService,
              private loggedUserService: LoggedUserService) {}

  private emitUpdatedLanguage() {
    this.languageService.emitLanguage(this.selectedLanguage.code)
  }

  private findSetAndEmitLanguage(lang: string, emit: boolean = true) {
    const idx = this.supportedLanguages.findIndex(l => l.code === lang);
    if (idx !== -1) {
      this.selectedLanguageId = idx;
      if (emit)
        this.emitUpdatedLanguage();
    }
  }

  ngOnInit(): void {
    // watch for language in query string
    this.route.queryParamMap.subscribe(paramMap => {
      const langParam = paramMap.get('lang');
      if (!langParam || langParam === this.languageService.language)
        return;
      this.findSetAndEmitLanguage(langParam);
    });

    // used to set language in UI (backend will use it if not provided)
    this.userService.me().subscribe(me => {
      this.findSetAndEmitLanguage(me.preferredLang.code, false);
      this.loggedUserService.user$.next(me);
    });
  }

  changeLanguage(index: number) {
    if (index < 0 || index >= this.supportedLanguages.length)
      return;
    this.selectedLanguageId = index;
    this.emitUpdatedLanguage();
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate([], {
      queryParams: { lang: this.selectedLanguage.code },
      queryParamsHandling: 'merge'
    });
  }

  get selectedLanguage(): Language {
    return this.supportedLanguages[this.selectedLanguageId];
  }

}
