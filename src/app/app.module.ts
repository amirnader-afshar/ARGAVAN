import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule } from "@angular/router";
import { AppComponent } from "./shared/app.component";
import { SlickModule } from 'ngx-slick';
// Modules
import { SharedModule } from "./shared/shared.module";
import { ADMModule } from "./adm/adm.module";
import { DemisInjector } from "./shared/util/Injector";
import { CoreModule } from "./shared/util/Core.module";

// Routes
export const ROUTES: any = [
  // Base
  { path: '', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) },
  { path: '', loadChildren: () => import('./adm/adm.module').then(m => m.ADMModule) },
  { path: '', loadChildren: () => import('./ofa/ofa.module').then(m => m.ofaModule) },
  { path: '', loadChildren: () => import('./msg/msg.module').then(m => m.msgModule) },
  { path: '', loadChildren: () => import('./edu/edu.module').then(m => m.eduModule) },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    CoreModule.forRoot({ storage: {} }),
    ADMModule,
    //TODO sm-edit: Module factory sharing
    RouterModule.forRoot(ROUTES, { useHash: true,scrollPositionRestoration: 'enabled', // or 'top'
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64]}),
    // RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  static injector: Injector;

  constructor(injector: Injector) {
    DemisInjector.injector = injector;
  }

}
