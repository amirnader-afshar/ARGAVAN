import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { BasePage } from 'src/app/shared/BasePage';
import { Deferred } from 'src/app/shared/Deferred';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';
import { TranslateService } from 'src/app/shared/services/TranslateService';
import { DataToPost } from 'src/app/shared/services/data-to-post.interface';
import { RouteData } from 'src/app/shared/util/RouteData';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent   extends BasePage  implements OnInit {

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
      text: ' جدید',
      visible: true
    },
    {
      name: "Edit",
      icon: "fa fa-edit blue",
      text: 'ویرایش ',
      visible: true
    }
  ]

  constructor(public translate: TranslateService, public router: Router
    , public service: ServiceCaller,private route: ActivatedRoute ,private routeDate: RouteData) {
    
    super(translate);      

  }

  ngOnInit(): void {
    this.menuItems[1].visible = false;   
    this.loadGrid();
  }
  onMenuItemClick(name) {
    if (name == "New") {  
        this.router.navigate(["crm/invoice"]);
    } 
    else if (name == "Edit") {
      var qp = {
        INVOICE_H_ID: this.selectedRow.INVOICE_H_ID             
      }
    
      this.router.navigate(["crm/invoice"] ,{ queryParams: qp }  );

    }
       
  }
    
  loadGrid(){
    this.dataToPostBody = {
      'Data': {
        'SPName': '[CRM].[CRM_SpINVOICE_H]',
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
          key: "INVOICE_H_ID",
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
  
    if (this.jasem.length == 0) {
      this.menuItems[1].visible = false;    

    } else if (this.jasem.length == 1) {
      this.menuItems[1].visible = true;
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
      
    } else {
      this.selectedRow = {};
      this.menuItems[1].visible = false;      
    }
  }


  onRowPrepared(e) {
    if (e.rowType === "data") {
        if (e.data.IS_READED) {
          e.rowElement.style.backgroundColor = 'rgb(102, 204, 255)';  
          e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");  
        }
        else{
          e.rowElement.style.backgroundColor = 'rgb(255, 207, 102)';  
          e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");  
        }
    }
}
}
