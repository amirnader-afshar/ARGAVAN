import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from 'src/app/shared/Deferred';
import { DataToPost } from 'src/app/shared/services/data-to-post.interface';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';
import { TranslateService } from 'src/app/shared/services/TranslateService';
import { Notify } from 'src/app/shared/util/Dialog';
import { RouteData } from 'src/app/shared/util/RouteData';

@Component({
  selector: 'app-lettet-template-list',
  templateUrl: './lettet-template-list.component.html',
  styleUrls: ['./lettet-template-list.component.scss']
})
export class LettetTemplateListComponent implements AfterViewInit, OnInit {
  menuItems = [
    {
      name: "New",
      icon: "fa fa-plus green",
      text: 'جدید',
      visible: true
    },
    {
      name: "Edit",
      icon: "fa fa-edit green",
      text: 'ویرایش',
      visible: true
    },
    {
      name: "Delete",
      icon: "fa fa-trash red",
      text: 'حذف',
      visible: true
    }
  ]
  @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;
  dataSource: any = {};
  jasem: any = [];
  dataToPostBody: DataToPost;
  selectedRow: any = {};

  constructor(public translate: TranslateService, public router: Router
    , public service: ServiceCaller
    ,private routeData: RouteData) { }

  ngAfterViewInit(): void {
      
    this.menuItems[1].visible = false;
    this.menuItems[2].visible = false;
    if (this.jasem.length > 0) {
      this.selectionChangedHandler();
    }
  }

  ngOnInit(): void {
    this.loadGrid();
  }

  loadGrid(){
    this.dataToPostBody = {
      'Data': {
        'SPName': '[OFA].[OFA_Sp_LETTER_TEMPLATE]',
        'Data_Input': { 'Mode': 4,          
         'Header': { }
        , 'Detail': '', 'InputParams': '' }
      }      
    }
  
    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {   
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
        this.dataSource=data.ReturnData.Data_Output[0].Header;  
        this.dataSource.store = new CustomStore({
          key: "LETTER_TEMP_ID",
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

   onMenuItemClick(name) {
    var qp = {
      LETTER_TEMP_ID: this.selectedRow.LETTER_TEMP_ID 
    }
    if (name == "New") {
      this.router.navigate(["ofa/ofa-letter-template"]);
    } else if (name == "Edit") {
      this.router.navigate(["ofa/ofa-letter-template"],{queryParams: qp});
    }
    else if (name=="Delete")
    {
      this.dataToPostBody = {
        'Data': {
          'SPName': '[OFA].[OFA_Sp_LETTER_TEMPLATE]',
          'Data_Input': { 'Mode': 3,          
           'Header': {LETTER_TEMP_ID: this.selectedRow.LETTER_TEMP_ID
                  ,LETTER_TEMP_ARGHAVAN_TIME_STAMP:this.selectedRow.LETTER_TEMP_ARGHAVAN_TIME_STAMP}
          , 'Detail': '', 'InputParams': '' }
        }      
      }    
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {   
        Notify.success("PUB_ACTION_SUCCESS_MSG");
      }); 
  
    }
  }
  selectionChangedHandler() {

    if (this.jasem.length == 0) {
      this.menuItems[1].visible = false;
      this.menuItems[2].visible = false;
    } else if (this.jasem.length == 1) {
      this.menuItems[1].visible = true;
      this.menuItems[2].visible = true;
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
      
    } else {
      this.selectedRow = {};
      this.menuItems[1].visible = false;
      this.menuItems[2].visible = true;
    }
  }
}
