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


@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent extends BasePage implements OnInit {

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
      text: 'ارسال پیام',
      visible: true
    },
    {
      name: "Edit",
      icon: "fa fa-edit green",
      text: 'مشاهده پیام',
      visible: true
    }
  ]

  constructor(public translate: TranslateService, public router: Router
    , public service: ServiceCaller,private route: ActivatedRoute) {
    
    super(translate);      

  }

  ngOnInit(): void {
    this.menuItems[1].visible = false;
    this.editItem.MSG_IN_OUT_TYPE = this.route.snapshot.data["MSG_IN_OUT_TYPE"];
    this.loadGrid();
  }
  onMenuItemClick(name) {
    if (name == "New") {  
        this.router.navigate(["msg/msgs"]);
    } 
    else if (name == "Edit") {
      var qp = {
        MSG_ID: this.selectedRow.MSG_ID 
        ,GRID_SOURCE:this.editItem.MSG_IN_OUT_TYPE        
      }
    
      this.router.navigate(["msg/msgs"] ,{ queryParams: qp }  );

    }

  }
    
  loadGrid(){
    this.dataToPostBody = {
      'Data': {
        'SPName': '[MSG].[MSG_Sp_MESSAGE]',
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
          key: "MSG_ID",
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
