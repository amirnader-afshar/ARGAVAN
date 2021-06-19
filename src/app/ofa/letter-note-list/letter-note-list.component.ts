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
  selector: 'app-letter-note-list',
  templateUrl: './letter-note-list.component.html',
  styleUrls: ['./letter-note-list.component.scss']
})
export class LetterNoteListComponent extends PopupBasePage implements AfterViewInit,OnInit {



  ngAfterViewInit(): void {
      
    this.menuItems[1].visible = false;
    this.menuItems[2].visible = false;
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
      'SPName': this.config.entityId?'[OFA].[OFA_Sp_LETTER_NOTE]':'[OFA].[OFA_Sp_LETTER_NOTE_SELECT_NO_LETTER_ID]',
      'Data_Input': { 'Mode': 4,          
       'Header': {'LETTER_NOTE_LETTER_ID':this.config.entityId
                   }
      , 'Detail': '', 'InputParams': '' }
    }
    
  }

  this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
  then((data) => {   
    if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
      this.dataSource=data.ReturnData.Data_Output[0].Header;  
      this.dataSource.store = new CustomStore({
        key: "LETTER_NOTE_ID",
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

 openPopup(row : any){
  this.popup.open(LetterNoteComponent, {
    title: 'یادداشت',
    width:"60%",
    height:"50%",
    data: {
        editItem:row,
        entityId: this.config.entityId,
        tabelName:'OFA_LETTER'
    } 
}).then(res => {
  this.loadGrid();
})
 }

  onMenuItemClick(name) {
    if (name == "New") {
      this.openPopup({LETTER_NOTE_IS_PUBLIC:true});
    } else if (name == "Edit") {
      this.openPopup(this.selectedRow);
    }
    else if (name=="Delete")
    {
      this.service.post("/PRG/PriceList/DeletePriceList", (data) => {        
        Notify.success("PUB_ACTION_SUCCESS_MSG");
      }, this.dataGrid.instance.getSelectedRowsData()[0]);
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

  closeExplorer() {
    this.popupInstance.close();

}
submitExplorer() {
        
  console.log('selected' ,this.dataGrid.selectedRowKeys);
  this.popupInstance.result(this.dataGrid.selectedRowKeys);
  this.popupInstance.close();
}

}
 
