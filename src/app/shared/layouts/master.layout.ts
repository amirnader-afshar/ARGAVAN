import { Component, AfterViewInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '../services/TranslateService';
import { ServiceCaller } from '../services/ServiceCaller';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/AuthService';
import { EventsService } from 'angular-event-service/dist';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { DemisPopupService } from '../components/popup/demis-popup-service';
import { ThemeService } from '../services/ThemeService';
import * as screenfull from 'screenfull';
import { Dialog } from '../util/Dialog';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import * as internal from 'node:stream';
import { PermissionService } from '../permission';
declare function page_init(): any;
declare function sidemenu_hide(): any;

@Component({
    selector: 'master-layout',
    templateUrl: './master.layout.html',
    animations: [
        trigger('navigation', [
            state('true', style({ left: '-20%' })),
            state('false', style({ left: '0%' })),
            transition('0 => 1', animate('.2s')),
            transition('1 => 0', animate('.2s'))

        ]),
        trigger('showOverlay', [
            state('true', style({ opacity: 1, display: 'block' })),
            state('false', style({ opacity: 0, display: 'none' })),
            transition('0 => 1', animate('.2s')),
            transition('1 => 0', animate('.5s'))

        ]),
        trigger('navigation2', [
            state('true', style({ left: '-20%' })),
            state('false', style({ left: '0%' })),
            transition('0 => 1', animate('.2s')),
            transition('1 => 0', animate('.2s'))

        ]),
        trigger('showOverlay2', [
            state('true', style({ opacity: 1, display: 'block' })),
            state('false', style({ opacity: 0, display: 'none' })),
            transition('0 => 1', animate('.2s')),
            transition('1 => 0', animate('.5s'))

        ])
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterLayoutComponent implements AfterViewInit {
    isLoading: boolean = false;
    navigation: boolean = true;
    showOverlay: boolean = false;
    navigation2: boolean = true;
    showOverlay2: boolean = false;
    version: string = '1.0';
    config: any = { items: [], subject: null };
    notifyCount : number=0;
    msgCount : number=0;
    letterCount : number=0;

    navigationDrawer() {
        this.navigation = !this.navigation;
        this.showOverlay = !this.showOverlay;
    }
    navigationDrawer2() {
        this.navigation2 = !this.navigation2;
        this.showOverlay2 = !this.showOverlay2;
    }
    constructor(
        private router: Router,
        public authService: AuthService,
        private route: ActivatedRoute,
        private service: ServiceCaller,
        private eventsService: EventsService,
        private cdr: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef,
        private demisPopupService: DemisPopupService,
        private themeService: ThemeService,public permissionService: PermissionService


    ) {


        //

        route.data.subscribe((data) => {
            if (data.config) {
                var keys = data.config.keys;
                this.config.subject = data.config.subject;
                if (keys && keys.length) {
                    service.getPromise('/ADM/Config/User/Display', { keys: keys }).then((b) => {
                        this.config.items = b;
                    });;
                }
                else {
                    this.config.items = [];
                }
            }
            else {
                this.config.items = [];
            }
        });
        this.version = localStorage.getItem('version');

    }

    ngAfterViewInit() {
        page_init();
        this.eventsService.on('loading', (value) => {
            if (value) {
                this.isLoading = true;
            } else {
                this.isLoading = false;
            }
            // this.cdr.markForCheck();
        })
    }

    toggleScreen() {
        if (screenfull.isEnabled) {
            screenfull.toggle();
            sidemenu_hide();
        }
    }

    gotoUserConfig(key) {
        if (key) {
            this.router.navigate(['/adm/user/configs'], { queryParams: { key: key } });
        }
        else {
            if (this.config.subject) {
                this.router.navigate(['/adm/user/configs'], { queryParams: { subject: this.config.subject } });
            }
            else {
                this.router.navigate(['/adm/user/configs']);
            }
        }
    }

    BtnClick_LogOut() {
        Dialog.confirm('خروج از برنامه', 'آیا مایل به خروج از برنامه هستید؟').okay(() => {
            this.authService.logout();
        });
    }

    ngOnDestroy(): void {
        this.viewContainerRef.clear();
    }
    ngOnInit(): void {
        this.demisPopupService.setRootViewContainerRef(this.viewContainerRef);
        this.loadUnreadMessage();
        this.loadUnreadLetter();
    }

    //  -------------- تغییر ظاهر برنامه -------------
    LightTheme() {
        this.themeService.lightTheme();
        localStorage.setItem('dx-theme', 'lightTheme')
        location.reload();
    }

    DarkTheme() {
        this.themeService.DarkTheme();
        localStorage.setItem('dx-theme', 'DarkTheme')
        location.reload();
    }

    LightMaterialTheme() {
        this.themeService.LightMaterialTheme();
        localStorage.setItem('dx-theme', 'LightMaterialTheme')
        location.reload();
    }

    redirectToMessage(){
        this.router.navigate(["msg/in-msg-list"]   );
    }

    redirectToLetter(){
        this.router.navigate(["ofa/inLetters"]   );
    }

    loadUnreadLetter()
    {
        if (this.permissionService.hasDefined('ofa') )
        {
        var dataToPostBody: DataToPost;
        var Header :any ={};  
        Header.LETTER_IN_OUT_TYPE = 'in'
        Header.LETTER_IS_READED = false;
        dataToPostBody = {
            'Data': {
              'SPName': '[OFA].[OFA_SP_GET_UNREAD_LETTER]',
              'Data_Input': { 'Mode': 4,          
               'Header': Header
              , 'Detail': '', 'InputParams': '' }
            }                    
          }
          this.service.postPromise("/adm/CommenContext/Run", dataToPostBody,{ loading: false }).
          then((data) => {     
            if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
                var d = data.ReturnData.Data_Output[0].Header.filter(x=>x.LETTER_ERJA_IS_READED===false);
              this.notifyCount=d.length+this.notifyCount;  
              this.letterCount=d.length;    
            }
            
          });
        }
    }

    loadUnreadMessage()
    {
        if (this.permissionService.hasDefined('msg') )
        {
        var dataToPostBody: DataToPost;
        var Header :any ={};
        Header.MSG_IN_OUT_TYPE='in'
        Header.RECIVER_READ=false;
        dataToPostBody = {
            'Data': {
              'SPName': '[MSG].[MSG_Sp_MESSAGE]',
              'Data_Input': { 'Mode': 4,          
               'Header': Header
              , 'Detail': '', 'InputParams': '' }
            }
            
          }
          this.service.postPromise("/adm/CommenContext/Run", dataToPostBody,{ loading: false }).
          then((data) => {     
            if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
              this.notifyCount=data.ReturnData.Data_Output[0].Header.length+this.notifyCount;  
              this.msgCount=data.ReturnData.Data_Output[0].Header.length;
                   
            }
            
          });          
        }
    }
}
