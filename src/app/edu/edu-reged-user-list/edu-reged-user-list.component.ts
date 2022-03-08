import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from '../../shared/Deferred';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { letProto } from 'rxjs-compat/operator/let';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { RouteData } from 'src/app/shared/util/RouteData';


@Component({
  selector: 'app-edu-reged-user-list',
  templateUrl: './edu-reged-user-list.component.html',
  styleUrls: ['./edu-reged-user-list.component.scss']
})
export class EduRegedUserListComponent  extends BasePage implements OnInit {
  editItem: any = {};
  COURSE_DATA :any={};
  @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;
  dataSource: any = {};
  jasem: any = [];
  dataToPostBody: DataToPost;

  menuItems = [
 
    {
      name: "sendSms",
      icon: "fa fa-paper-plane-o green",
      text: 'ارسال پیامک',
      visible: true
    }]
  

    constructor(public translate: TranslateService, public router: Router
      , public service: ServiceCaller,private route: ActivatedRoute ,private routeDate: RouteData) {
      
      super(translate);  
      
      this.route.queryParams.subscribe(params => {
        this.editItem.USER_COURSE_EDU_COURSE_ID = params['COURSE_ID'];
    });
  
    } 

    ngOnInit(): void {
      this.COURSE_DATA = this.routeDate.pop('COURSE_DATA') ;
      this.loadGrid();
    }
  
    onMenuItemClick(name) {
   if (name == "sendSms") {
        this.routeDate.push('SMS_STATIC_DATA',this.COURSE_DATA);
        this.routeDate.push('SMS_RACIVERS',this.dataGrid.instance.getSelectedRowsData())
        this.router.navigate(["msg/send-sms"] );
  
      }
  
    }
      
    loadGrid(){
      this.dataToPostBody = {
        'Data': {
          'SPName': '[EDU].[EDU_Sp_USER_COURSE]',
          'Data_Input': { 'Mode': 4,          
           'Header': this.editItem
          , 'Detail': '', 'InputParams': '' }
        }
        
      }
  
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {     
        if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
          this.dataSource=data.ReturnData.Data_Output[0].Header;  
          this.dataSource.store = new CustomStore({
            key: "USER_COURSE_ID",
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

    onEditorPreparing(e:any): void {  
      if(e.dataField == "PERSONINFO_NAME" && e.parentType == "dataRow"){  
          e.editorOptions.disabled = !e.row.inserted;  
      }  
    }

    savetoApi(data)
    {
      this.dataToPostBody = {
        'Data': {
          'SPName': '[EDU].[EDU_Sp_USER_COURSE]',
          'Data_Input': { 'Mode': 20,          
           'Header': data
          , 'Detail': '', 'InputParams': '' }
        }          
      }
      return this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
          then((data) => {     
            if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        
            }      
          });
    }

     async save(e) {
      for (let index = 0; index < e.changes.length; index++) {
        var _changedData : any  ={} ;
        _changedData.USER_COURSE_IS_PASSED =e.changes[index].data.USER_COURSE_IS_PASSED != undefined ?e.changes[index].data.USER_COURSE_IS_PASSED : e.changes[index].key.USER_COURSE_IS_PASSED   
        _changedData.USER_COURSE_SCORE =e.changes[index].data.USER_COURSE_SCORE ?e.changes[index].data.USER_COURSE_SCORE : e.changes[index].key.USER_COURSE_SCORE   
        _changedData.USER_COURSE_ID = e.changes[index].key.USER_COURSE_ID;
        _changedData.USER_COURSE_ARGHAVAN_TIME_STAMP=e.changes[index].key.USER_COURSE_ARGHAVAN_TIME_STAMP;               
        await this.savetoApi(_changedData);
      }
    }

    async onSaving(e: any) {
      e.cancel = true;
  
      if (e.changes.length) {
        await this.save(e);
        this.loadGrid();
        e.component.cancelEditData(); 
      }
    } 

  }
  
