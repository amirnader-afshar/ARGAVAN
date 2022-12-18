import { Component, OnInit, ViewChild, AfterViewInit,EventEmitter,Output } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router } from '@angular/router';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from '../../shared/Deferred';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { RouteData } from '../../shared/util/RouteData';
import { LetterNoteComponent } from '../letter-note/letter-note.component';
import { DemisPopupService } from "../../shared/components/popup/demis-popup-service";
import { PopupBasePage } from '../../shared/BasePage';

@Component({
  selector: 'app-lettrt-erjaat',
  templateUrl: './lettrt-erjaat.component.html',
  styleUrls: ['./lettrt-erjaat.component.scss']
})
export class LettrtErjaatComponent extends PopupBasePage implements AfterViewInit,OnInit {
  ngAfterViewInit(): void {
      
    if (this.jasem.length > 0) {
      this.selectionChangedHandler();
    }
  }
  ngOnInit():void{
    this.config = this.popupInstance.data;
    this.loadGrid();
  }
  @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;
  dataSource: any = {};
  selectedRow: any = {};
  jasem: any = [];
  dataToPostBody: DataToPost;
  config;
  allMode: string;
  checkBoxesMode: string;


  constructor(public translate: TranslateService, public router: Router
    , public service: ServiceCaller
    ,private routeData: RouteData,public popup: DemisPopupService) {
    
    super(translate);      
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always'
  }

 loadGrid(){
  this.dataToPostBody = {
    'Data': {
      'SPName': '[OFA].[OFA_Sp_LETTER_ERJA]',
      'Data_Input': { 'Mode': 4,          
       'Header': {'LETTER_ERJA_LETTER_ID':this.config.entityId
                   }
      , 'Detail': '', 'InputParams': '' }
    }
    
  }

  this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
  then((data) => {
    if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {     
          let _data=data.ReturnData.Data_Output[0].Header[0];  
          this.dataSource =  [ ..._data.LETTER_CMPNY_RECIVERS_DATA? _data.LETTER_CMPNY_RECIVERS_DATA:[]
          , ..._data.LETTER_NONE_CMPNY_RECIVERS_DATA?_data.LETTER_NONE_CMPNY_RECIVERS_DATA:[]];  

          this.dataSource.store = new CustomStore({
            key: "LETTER_ERJA_ID",
            load: (loadOptions) => {
              let deferred: Deferred<any> = new Deferred<any>();
              console.log("dataSource", this.dataSource);
              deferred.resolve(this.dataSource);
              return deferred.promise;        
            },
          });      
    }
  });


 };




  selectionChangedHandler() {

 
  }



}
 

