import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from '../../shared/Deferred';
import { DataToPost } from "../../shared/services/data-to-post.interface";

import { locale, loadMessages, formatMessage } from 'devextreme/localization';


@Component({
  selector: 'app-out-letters',
  templateUrl: './out-letters.component.html',
  styleUrls: ['./out-letters.component.scss']
})

  export class OutLettersComponent extends BasePage implements AfterViewInit,OnInit {
    ngAfterViewInit(): void {
      
      this.menuItems[1].visible = false;
      this.menuItems[2].visible = false;
      if (this.jasem.length > 0) {
        this.selectionChangedHandler();
      }
    }
    ngOnInit():void{
      this.editItem.LETTER_IN_OUT_TYPE = this.route.snapshot.data["LETTER_IN_OUT_TYPE"];  
      this.editItem.archive = this.route.snapshot.data["archive"]; 
      this.loadGrid();
    
      
    }
    editItem: any = {};
    @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;
    dataSource: any = {};
    selectedRow: any = {};
    jasem: any = [];
    dataToPostBody: DataToPost;
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
        visible: false
      }
    ]
  
  
    constructor(public translate: TranslateService, public router: Router
      , public service: ServiceCaller,private route: ActivatedRoute) {
      
      super(translate);      
      //locale('fa');

    }
  
   loadGrid(){

    this.dataSource = new CustomStore({
      key: "LETTER_ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.editItem.PageNumber=loadOptions.skip/loadOptions.take;
        this.editItem.filter={};
        this.editItem.RowspPage=loadOptions.take;
        if (loadOptions.filter)
         {
          if (!Array.isArray(loadOptions.filter[0]))
           {
            this.editItem.filter[loadOptions.filter[0]] = loadOptions.filter[2];
           }
           else {
              loadOptions.filter.forEach(f => {
                if(Array.isArray(f))
                {

                  let result = this.editItem.filter.hasOwnProperty(f[0]);
                  if (result==false)
                    {
                      if(Array.isArray(f[0]))   
                        {
                          this.editItem.filter[f[0][0]] = f[0][2];
                        } 
                      else               
                        this.editItem.filter[f[0]] = f[2];
                    }
                }
              });
           }
        }

        this.dataToPostBody = {
          'Data': {
            'SPName': '[OFA].[OFA_Sp_letter]',
            'Data_Input': { 'Mode': 4,          
             'Header': this.editItem
            , 'Detail': '', 'InputParams': '' }
          }
          
        }        
        this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {     
          if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
            //this.dataSource=data.ReturnData.Data_Output[0].Header;  
            console.log("loadOptions", loadOptions);
            deferred.resolve({data:data.ReturnData.Data_Output[0].Header,
              totalCount: data.ReturnData.Data_Output[0].Detail[0].TOTALCOUNT });       
          }  
          else
          {
            deferred.reject("No data Found!");
          }        
        });
    

      
        
        return deferred.promise;        
      },
      }); 

   
  
   };
  
    onMenuItemClick(name,id) {
      var qp = {
        LETTER_ID: this.selectedRow.LETTER_ID 
        ,GRID_SOURCE:this.editItem.LETTER_IN_OUT_TYPE
        ,archive:this.editItem.archive
      }
      var routPath = "";
      if(this.editItem.LETTER_IN_OUT_TYPE=='out')
       routPath="ofa/outLetter";
      else
       routPath="ofa/inLetter";

      if (name == "New") {
        
          this.router.navigate([routPath],{queryParams: qp});
        
      } else if (name == "Edit") {        
        if (id!="")
          {qp.LETTER_ID=id}
        this.router.navigate([routPath],{queryParams: qp});
      }
      else if (name=="Delete")
      {
        this.dataToPostBody = {
          'Data': {
            'SPName': '[OFA].[OFA_Sp_letter]',
            'Data_Input': { 'Mode': 3,          
             'Header': this.selectedRow
            , 'Detail': '', 'InputParams': '' }
          }
          
        }
    
        this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {     
          
            Notify.success("PUB_ACTION_SUCCESS_MSG");          
            this.loadGrid();          
          
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
   