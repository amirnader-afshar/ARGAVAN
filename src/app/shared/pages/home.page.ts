import { Component, OnInit } from '@angular/core';
import config from 'devextreme/core/config';
import { EventsService } from 'angular-event-service/dist';
import { ServiceCaller } from "../services/ServiceCaller";
import { RouteData } from "../util/RouteData";
import { MenuService } from '../services/MenuService';
import { Router } from '@angular/router';

import { DataToPost } from "../../shared/services/data-to-post.interface";

declare function home_refresh_menu(): any;

@Component({
    selector: 'home-page',
    templateUrl: './home.page.html'
})
export class HomePage implements OnInit {

    list: any[];
    UnreadLetterCount : number;
    UnreadMsgCount : number;

    ngOnInit(): void {
        let that = this;
        this._menuService.getModuleList().then(res => {
            that.list = res;
        })
        this.loadUnreadLetter();
        this.loadUnreadMessage();
    }

    constructor(
        private eventsService: EventsService, 
        private service: ServiceCaller, 
        private routeData: RouteData, 
        private router: Router, 
        private _menuService: MenuService) {

    }


    selectSystem(item: any) {
        this.router.navigate([item.Path.trim()]);
    }

    loadUnreadLetter()
    {
        var dataToPostBody: DataToPost;
        var Header :any ={};  
        Header.LETTER_IN_OUT_TYPE = 'in'
        Header.LETTER_IS_READED = false;
        dataToPostBody = {
            'Data': {
              'SPName': '[OFA].[OFA_Sp_letter]',
              'Data_Input': { 'Mode': 4,          
               'Header': Header
              , 'Detail': '', 'InputParams': '' }
            }                    
          }
          this.service.postPromise("/adm/CommenContext/Run", dataToPostBody).
          then((data) => {     
            if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
                var d = data.ReturnData.Data_Output[0].Header.filter(x=>x.LETTER_IS_READED===false);                
              this.UnreadLetterCount=d.length;    
            }
            
          });
    }
    loadUnreadMessage()
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
          this.service.postPromise("/adm/CommenContext/Run", dataToPostBody).
          then((data) => {     
            if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {             
              this.UnreadMsgCount=data.ReturnData.Data_Output[0].Header.length;                   
            }
            
          });          
    }    
}
