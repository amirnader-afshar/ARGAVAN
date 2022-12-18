import {  Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { BasePage } from '../../shared/BasePage';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import { Deferred } from '../../shared/Deferred';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { PermissionService } from '../../shared/permission';
import { CoreService } from "../../shared/services/CoreService";

import { DemisPopupService } from "../../shared/components/popup/demis-popup-service";
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { RouteData } from '../../shared/util/RouteData';
import { ConfigService } from 'src/app/shared/services/ConfigService';


@Component({
  selector: 'app-reciver',
  templateUrl: './reciver.component.html',
  styleUrls: ['./reciver.component.scss']
})
export class ReciverComponent extends BasePage implements OnInit {

  editItem: any = {};
  dataToPostBody: DataToPost;
  FilterCompanyCondition: any = { SUSR_CMPN_ID: null };
  dataSource: any = {};
  selectedRow: any = {};
  jasem: any = [];
  menuItems = [
    {
      name: "Delete",
      icon: "fa fa-trash red",
      text: 'حذف',
      visible: true
    }
  ]
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;

  constructor(public translate: TranslateService
    , public router: Router,
    private route: ActivatedRoute
    , public service: ServiceCaller
    ,public permissionService: PermissionService,
    public core: CoreService,
    public popup: DemisPopupService,
    private routeData: RouteData, private confService: ConfigService,) {
    super(translate);
   }

  ngOnInit(): void {
    this.loadGrid();
  }
  onMenuItemClick(name) {
 if (name=="Delete")
    {
      this.dataToPostBody = {
        'Data': {
          'SPName':'[OFA].[OFA_Sp_RECIVER]',
          'Data_Input': { 'Mode': 3,          
           'Header': this.selectedRow
          , 'Detail': '', 'InputParams': '' }
        }        
      }
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {
        this.loadGrid();
        Notify.success('اطلاعات با موفقیت حذف شد');
      });
    }
  }

  selectionChangedHandler() {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];      
  }

  loadGrid(){
    this.dataToPostBody = {
      'Data': {
        'SPName':'[OFA].[OFA_Sp_RECIVER]',
        'Data_Input': { 'Mode': 4,          
         'Header': {}
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.dataToPostBody.Data.Data_Input.Mode=4;
          this.dataToPostBody.Data.Data_Input.Header={};
        this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {   
          if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
            console.log(data.ReturnData.Data_Output[0].Header) 
            deferred.resolve(data.ReturnData.Data_Output[0].Header);
           }   
          else
           {
            deferred.resolve([]);
           }
        }).catch((err) => {
          deferred.reject(err);
      });      
              
        
        return deferred.promise;        
    },
    update: (key, values) => {
      let deferred: Deferred<any> = new Deferred<any>();       
      let row = this.dataGrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
      let data: any = Object.assign(row, values);
      this.dataToPostBody.Data.Data_Input.Mode=2;
      this.dataToPostBody.Data.Data_Input.Header=data;
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {            
        deferred.resolve(data);        
        }).catch((err) => {
          deferred.reject(err);
      });      
      return deferred.promise;
  }
  ,
  insert: ( values) => {
    let deferred: Deferred<any> = new Deferred<any>();       
    this.dataToPostBody.Data.Data_Input.Mode=1;
    this.dataToPostBody.Data.Data_Input.Header=values;
    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {            
      deferred.resolve(data);        
      }).catch((err) => {
        deferred.reject(err);
    });      
    return deferred.promise;
}
,remove:(key)=> {
  let deferred: Deferred<any> = new Deferred<any>();   
  let row = this.dataGrid.instance.getDataSource().items().filter(c => c.ID == key)[0];    
  this.dataToPostBody.Data.Data_Input.Mode=3;
  this.dataToPostBody.Data.Data_Input.Header={RECIVER_ID:key,RECIVER_ARGHAVAN_TIME_STAMP:row.RECIVER_ARGHAVAN_TIME_STAMP};
  this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
  then((data) => {            
    deferred.resolve(data);        
    }).catch((err) => {
      deferred.reject(err);
  });      
  return deferred.promise; 
},
    });
  
   };
  


  addClick(e){
    var result = this.form.instance.validate();
  if (result.isValid) 
      {    
          this.dataToPostBody = {
            'Data': {
              'SPName': '[OFA].[OFA_Sp_RECIVER]',
              'Data_Input': { 'Mode': 1,          
                            'Header': this.editItem
                            , 'Detail': {}
                          }
                  }
              };
          
          this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
          then((data) => {
            this.editItem={}    ;
            this.loadGrid();
            Notify.success('اطلاعات با موفقیت ذخیره شد');
          });
      }

    }

}
