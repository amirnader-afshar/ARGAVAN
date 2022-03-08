import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from '../../shared/Deferred';
import { DataToPost } from "../../shared/services/data-to-post.interface";


@Component({
  selector: 'app-msg-sms-list',
  templateUrl: './msg-sms-list.component.html',
  styleUrls: ['./msg-sms-list.component.scss']
})
export class MsgSmsListComponent extends BasePage implements OnInit {

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
      text: 'ارسال پیامک',
      visible: true
    },
    {
      name: "Edit",
      icon: "fa fa-edit green",
      text: 'مشاهده پیامک',
      visible: true
    }
  ]

  constructor(public translate: TranslateService, public router: Router
    , public service: ServiceCaller,private route: ActivatedRoute) {
    
    super(translate);      

  }

  ngOnInit(): void {
    this.menuItems[1].visible = false;    
    this.loadGrid();
  }
  onMenuItemClick(name) {
    if (name == "New") {  
        this.router.navigate(["msg/send-sms"]);
    } 
    else if (name == "Edit") {
      var qp = {
        SMSH_ID: this.selectedRow.SMSH_ID            
      }
    
      this.router.navigate(["msg/send-sms"] ,{ queryParams: qp }  );

    }

  }
    
  loadGrid(){
    this.dataToPostBody = {
      'Data': {
        'SPName': '[MSG].[MSG_Sp_SMS_HEADER]',
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
          key: "SMSH_ID",
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

}

