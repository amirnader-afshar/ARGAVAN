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
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent extends BasePage implements OnInit {


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
          'SPName':'[OFA].[OFA_Sp_CATEGORY]',
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
        'SPName':'[OFA].[OFA_Sp_CATEGORY]',
        'Data_Input': { 'Mode': 4,          
         'Header': {}
        , 'Detail': '', 'InputParams': '' }
      }
      
    }
  
    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {   
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
        this.dataSource=data.ReturnData.Data_Output[0].Header;  
        this.dataSource.store = new CustomStore({
          key: "CATEGORY_ID",
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
  


  addClick(e){
    var result = this.form.instance.validate();
  if (result.isValid) 
      {    
          this.dataToPostBody = {
            'Data': {
              'SPName': '[OFA].[OFA_Sp_CATEGORY]',
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
