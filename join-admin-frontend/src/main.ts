import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";
import {environment} from "./environments/environment";
import {AdminModule} from "./app/admin.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AdminModule);
