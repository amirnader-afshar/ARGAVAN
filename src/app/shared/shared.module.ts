import { NgModule, APP_INITIALIZER, ErrorHandler, ModuleWithProviders ,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DevExtremeModule} from 'devextreme-angular';
import { DocumentEditorContainerModule  } from '@syncfusion/ej2-angular-documenteditor';

import { BasePage, PopupBasePage } from './BasePage';
import { Deferred } from './Deferred';
import { LabelComponent } from './components/label.component';
import { PageContentComponent } from './components/ui/content.component';
import { NavSideMenuComponent } from './components/ui/sidemenu.component';
import { BreadcrumbsComponent } from './components/ui/breadcrumb.component';
import { LoginLayoutComponent } from './layouts/login.layout';
import { MasterLayoutComponent } from './layouts/master.layout';
import { LoginPage } from './pages/login.page';
import { ResetPasswordPage } from './pages/setpass.page';
import { HomePage } from './pages/home.page';
import { DXLovComponent } from './components/dx-lov.component';
import { DXToolbarComponent } from './components/dx-toolbar.component';
import { DXLabelBoxComponent } from './components/ui/dx-label-box';
import { DXGridToolbarComponent } from './components/gridtoolbar/dx-gridtoolbar.component';
import { DXGridToolbarDataSourceComponent } from './components/gridtoolbar/dataSource.component';
import { DXTreeToolbarComponent } from './components/gridtoolbar/dx-treetoolbar.component';
import { PopupComponent } from './components/popup/popup.component';
import { SearchComponent } from './components/search/search.component';
import { InputGroupComponent } from './components/inputGroup/inputgroup.component';
import { BorderedInputComponent } from './components/chequeComponents/borderedInput/borderedInput.component';
import { TextViewComponent } from './components/textview/textview.component';

import { DynamicFormPage } from './pages/dform.page';
import { TestPage } from './pages/test.page';
import { UiTestPage } from './pages/uiTest.page';
import { HasanzadePage } from './pages/hasanzade.page';

import { FileExplorerPopupPage } from './components/fileExplorer/fileexplorer.popup';

import { NotFoundPage } from './pages/404.page';
import { AccessDeniedPage } from './pages/403.page';
import { PageComponent } from './components/ui/page.component';
import { DXDateBoxComponent } from './components/datepicker/dx-date-picker';
import { DXTimeBoxComponent } from './components/ui/dx-time-picker';
import { TranslateService } from './services/TranslateService';
import { TranslatePipe } from './pipes/translate.pipe';
import { ServiceCaller } from './services/ServiceCaller';
import { PrintComponent } from './components/print.component';

import { MenuService } from './services/MenuService';
import { AuthGuard } from './services/AuthGuard';
import { AuthService } from './services/AuthService';
import { SmsService } from './services/SmsService';
import { RouteData } from './util/RouteData';
import { EventsServiceModule } from 'angular-event-service/dist';
import { ModuleHomePage } from './pages/module-home.page';
import { ReportPage } from './report/report.page';
import { ReportButtonComponent } from './report/dx-report.component';

import { DatePipe } from '@angular/common';
import { DateTimeJalaliPipe } from './components/datepicker/datetime-jalali.pipe';
import { InputMaskDirective } from './components/datepicker/input-mask.directive';
import { DraggableDirective } from './directives/Draggable.directive';
// import { FormsModule } from '@angular/forms';

import { PermissionService } from './permission/services/permission.service';
import { PermissionHelper } from './permission/services/permission-helper.service';

import { FileService } from './services/FileService';
import { DemisErrorHandler } from './errorHandler/DemisErrorHandler';
import { HttpErrorInterceptor } from './errorHandler/http-error.interceptor';
import { HttpClientHandler } from './errorHandler/http-error.tldr';
import { PanelBoxComponent } from './components/panelbox/panelbox.component';
import { TransInputComponent } from './components/transInput/transinput.component';
import { ADMConfigsPage } from '../adm/setup/configs.page';
import { ConfigType } from '../adm/shared/types/ConfigType';
import { DemisPopup } from './components/popup/demis-popup';
import { DemisPopupService } from './components/popup/demis-popup-service';
import { ConfigService } from './services/ConfigService';
import { ThemeService } from './services/ThemeService';
import { PopupTest } from './pages/popup.test';
import { CoreService } from './services/CoreService';
import { UploadPopupComponent } from './components/fileExplorer/upload.popup';
import { FolderPopupComponent } from './components/fileExplorer/folder.popup';
import { FileExplorerService } from './components/fileExplorer/fileexplorer.service.proxy';
import { FolderExplorerService } from './components/fileExplorer/folderexplorer.service.proxy';
import { FileExplorerManager } from './components/fileExplorer/fileexplorer.service';
import { LoginPopup } from './pages/login.popup';
import { DialogService, NotifyService } from './util/Dialog';
import { FileExplorerConfigComponent } from './components/fileExplorer/fileexplorer.config.component';
import { FormsModule } from '@angular/forms';
import { SunPopUpDatepickerComponent } from './components/datepicker/sunpopupdatepicker.component';
import { LangSelectorComponent } from './components/ui/lang-selector/lang-selector.component';
import { JalaliPipe } from './pipes/jalali_show_date_full_name';
import { HistoryComponent } from './components/history/history.component';
import { HistoryService } from './services/HistoryService';
import { SignupComponent } from './pages/signup/signup.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { WebsocketService } from './services/WebsocketService';
import { ScanService } from './services/ScanService';


const packageVersion = require('../../../package.json');

declare function page_actions(): any;



export function onStartup(service: ServiceCaller): () => Promise<any> {
  return () => {
    let currentVersion = packageVersion.version;
    localStorage.setItem('version', currentVersion);

    if (localStorage.getItem('translate') == null) {
      let deferred: Deferred<any> = new Deferred<any>();
      let default_lang = localStorage.getItem("USER_Defaultlang");      
      if (default_lang === null) 
          default_lang="Fa"      
      service.get('/SYS/Lang/String/List', data => {
        //use entries to create array of translates
        localStorage.setItem('translate', JSON.stringify(Object.entries(data)));
        deferred.resolve(true);
      }, { lang: default_lang, Token: null });
      return deferred.promise;
    }
  };
}
function needUpdate(currentVersion: string ) {
  let lastVersion = localStorage.getItem('version');

  if (lastVersion && lastVersion >= currentVersion) return false;
  return true;
}
export function CanAlwaysActivateGuard(): boolean {
  return true;
}

export const ROUTES: any = [
  {
    path: '',
    component: MasterLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePage },
      { path: 'edm/home', component: FileExplorerPopupPage },
      { path: 'PUB/FORM/:code', component: DynamicFormPage },
      { path: 'pub/report', component: ReportPage },
      { path: 'adm/configs', component: ADMConfigsPage, data: { mode: ConfigType.Company, subject: 'ADM-CNF-10' } },
      { path: 'ofa/configs', component: ADMConfigsPage, data: { mode: ConfigType.Company, subject: 'OFA' } },
      { path: 'msg/configs', component: ADMConfigsPage, data: { mode: ConfigType.Company, subject: 'MSG' } },
      // { path: 'mfg/configs', component: ADMConfigsPage, data: { mode: ConfigType.User, subject: 'BOM' } },
      // { path: 'adm/user/configs', component: ADMConfigsPage, data: { mode: ConfigType.User, subject: 'ADM-USR-10' } },
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    canActivate: ['CanAlwaysActivateGuard'],
    canActivateChild: ['CanAlwaysActivateGuard'],
    children: [
      { path: 'login', component: LoginPage },
      { path: 'setpass', component: ResetPasswordPage },
      { path: '404', component: NotFoundPage },
      { path: '403', component: AccessDeniedPage },
      { path:'signup',component:SignupComponent}
    ]
  },
];

@NgModule({
  declarations: [
    
    MasterLayoutComponent,
    LoginLayoutComponent,
    LabelComponent,
    PageContentComponent,
    BreadcrumbsComponent,
    NavSideMenuComponent,
    PanelBoxComponent,
    DXLovComponent,
    DXToolbarComponent,
    DXLabelBoxComponent,
    DXGridToolbarComponent,
    DXDateBoxComponent,
    DXTimeBoxComponent,
    DXGridToolbarDataSourceComponent,
    DXTreeToolbarComponent,
    PopupComponent,
    SearchComponent,
    InputGroupComponent,
    TextViewComponent,
    BasePage,
    PopupBasePage,
    LoginPage,
    ResetPasswordPage,
    NotFoundPage,
    AccessDeniedPage,
    HomePage,
    ModuleHomePage,
    DynamicFormPage,
    TestPage,
    UiTestPage,
    HasanzadePage,
    //
    FileExplorerPopupPage,
    UploadPopupComponent,
    FolderPopupComponent,
    FileExplorerConfigComponent,
    PageComponent,
    JalaliPipe,
    TranslatePipe,
    ReportPage,
    DateTimeJalaliPipe,
    InputMaskDirective,
    ReportButtonComponent,
    DraggableDirective,
    PopupTest,
    BorderedInputComponent,
    TransInputComponent,
    ADMConfigsPage,
    DemisPopup,
    LoginPopup,
    SunPopUpDatepickerComponent,
    LangSelectorComponent,
    HistoryComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    DevExtremeModule,DocumentEditorContainerModule,
    NgbModule, FormsModule,NgxJsonViewerModule,
    RouterModule.forChild(ROUTES),
    HttpClientModule,
    EventsServiceModule.forRoot(),
  ],
  providers: [HistoryService,
    DatePipe,
    CoreService,
    ServiceCaller,
    FileService,
    ConfigService,
    ThemeService,
    FileExplorerService,
    FileExplorerManager,
    FolderExplorerService,
    PrintComponent,
    MenuService,
    AuthGuard,
    AuthService,
    SmsService,
    WebsocketService,
    ScanService,
    DemisPopupService,
    DialogService,
    NotifyService,
    TranslateService,
    {
      provide: 'CanAlwaysActivateGuard',
      useValue: CanAlwaysActivateGuard
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onStartup,
      deps: [ServiceCaller],
      multi: true
    },
    PermissionService,
    PermissionHelper,
    HttpClientHandler,
    { provide: ErrorHandler, useClass: DemisErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  exports: [
    //
    NgxJsonViewerModule,
    DevExtremeModule,
    DocumentEditorContainerModule,
    NgbModule, FormsModule,
    DateTimeJalaliPipe,
    // DxTextBoxModule ,
    // DxNumberBoxModule ,
    // DxMenuModule,
    // DxDataGridModule,
    // DxPopupModule,
    // DxTabsModule,
    // DxTagBoxModule,
    //
    RouterModule,
    //
    LabelComponent,
    PageComponent,
    PageContentComponent,
    PanelBoxComponent,
    DXLovComponent,
    DXToolbarComponent,
    DXTreeToolbarComponent,
    DXLabelBoxComponent,
    DXGridToolbarComponent,
    DXDateBoxComponent,
    DXTimeBoxComponent,
    DXGridToolbarDataSourceComponent,
    JalaliPipe,
    TranslatePipe,
    ReportPage,
    ReportButtonComponent,
    PopupComponent,
    TextViewComponent,
    SearchComponent,
    InputGroupComponent,
    DraggableDirective,
    PopupTest,
    FileExplorerPopupPage,
    UploadPopupComponent,
    FolderPopupComponent,
    ADMConfigsPage,
    FileExplorerConfigComponent,
    SunPopUpDatepickerComponent,
    HistoryComponent
  ],
  entryComponents: [DemisPopup, LoginPopup, FileExplorerPopupPage, UploadPopupComponent, FolderPopupComponent]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [MenuService, AuthService, ConfigService, CoreService,SmsService,WebsocketService,ScanService]
    }
  }
}
