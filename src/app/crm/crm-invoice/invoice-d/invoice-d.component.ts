import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from 'src/app/shared/Deferred';
import { PermissionService } from 'src/app/shared/permission';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';
import { DataToPost } from 'src/app/shared/services/data-to-post.interface';

@Component({
  selector: 'app-invoice-d',
  templateUrl: './invoice-d.component.html',
  styleUrls: ['./invoice-d.component.scss']
})
export class InvoiceDComponent implements OnInit {

  @Output() detailData : EventEmitter<any>= new EventEmitter<any>();
  @Output() deletedData : EventEmitter<any>= new EventEmitter<any>();

  @Input() item: any = {};

  DetailDataSource: any = [];
  ItemDatasource:any = {};
  editItem: any = {};
  dropDownOptions = { width: 500 };

  isGridBoxOpened = false;

  CRM_ITEM_INSERT; 
  CRM_ITEM_DELETE; 
  CRM_ITEM_UPDATE; 

  INVOICE_D_IRC;
  INVOICE_D_CACH_PRICE;
  INVOICE_D_TARGET_PERCENT;
  INVOICE_D_FINAL_PRICE;
  INVOICE_D_MIN_ORDER;
  INVOICE_D_EXPIRE;
  INVOICE_D_VALIDATE;
  INVOICE_D_PREPER;
  INVOICE_D_SITE_PRICE;

  CRM_INVOICE_D_SUBDETAIL_VIEW;

  @ViewChild('detailGrid',{static: false}) detailGrid: DxDataGridComponent;
  @ViewChild('itemGrid',{static: true}) itemGrid: DxDataGridComponent;

  constructor(public service: ServiceCaller,public permissionService: PermissionService) { 

    this.CRM_ITEM_INSERT = this.permissionService.hasDefined('CRM_ITEM_INSERT');
    this.CRM_ITEM_DELETE = this.permissionService.hasDefined('CRM_ITEM_DELETE');
    this.CRM_ITEM_UPDATE = this.permissionService.hasDefined('CRM_ITEM_UPDATE');

    this.INVOICE_D_IRC =this.permissionService.hasDefined('INVOICE_D_IRC');
    this.INVOICE_D_CACH_PRICE =this.permissionService.hasDefined('INVOICE_D_CACH_PRICE');
    this.INVOICE_D_TARGET_PERCENT =this.permissionService.hasDefined('INVOICE_D_TARGET_PERCENT');
    this.INVOICE_D_FINAL_PRICE =this.permissionService.hasDefined('INVOICE_D_FINAL_PRICE');
    this.INVOICE_D_MIN_ORDER =this.permissionService.hasDefined('INVOICE_D_MIN_ORDER');
    this.INVOICE_D_EXPIRE =this.permissionService.hasDefined('INVOICE_D_EXPIRE');
    this.INVOICE_D_VALIDATE =this.permissionService.hasDefined('INVOICE_D_VALIDATE');
    this.INVOICE_D_PREPER =this.permissionService.hasDefined('INVOICE_D_PREPER');
    this.INVOICE_D_SITE_PRICE =this.permissionService.hasDefined('INVOICE_D_SITE_PRICE');

    this.CRM_INVOICE_D_SUBDETAIL_VIEW =this.permissionService.hasDefined('CRM_INVOICE_D_SUBDETAIL_VIEW');



      
    this.ItemDatasource = this.MakeDatasource(this.service,'[CRM].[CRM_Spitem]');

    }

  ngOnInit(): void {

    if (this.item)
      this.DetailDataSource = this.loadGrid(); 

  }


  onSaving(e){
    this.detailData.emit(this.DetailDataSource);
  }

  onSelectionChanged(selectedRowKeys, cellInfo, dropDownBoxComponent) {
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
    }
  }

  MakeDatasource(ser:ServiceCaller,SPName:string){
    let _datatopost={
        'Data': {
          'SPName':SPName,
          'Data_Input': { 'Mode': 4,          
           'Header': {}
          , 'Detail': '', 'InputParams': '' }
        }      
      }
      return new CustomStore({
        loadMode: 'raw',
        key: 'ID',
        load() {
          let deferred: Deferred<any> = new Deferred<any>();
          _datatopost.Data.Data_Input.Mode=4;
          _datatopost.Data.Data_Input.Header={};
          ser.postPromise("/adm/CommenContext/Run", _datatopost).
          then((data) => {   
            if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
              console.log(data.ReturnData.Data_Output[0].Header)             
              deferred.resolve(data.ReturnData.Data_Output[0].Header);
              
             } else
             {
              deferred.resolve([]);
             }    
          });
          return deferred.promise;                           
        },
        update: (key, values) => {
          let deferred: Deferred<any> = new Deferred<any>(); 
          let row:any; 
          if (_datatopost.Data.SPName==='[CRM].[CRM_SpINVOICE_D]')  {        
            row = this.detailGrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
          } 
         else if (_datatopost.Data.SPName==='[CRM].[CRM_Spitem]')  {    
           row = this.itemGrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
          }  
          let data: any = Object.assign(row, values);
          _datatopost.Data.Data_Input.Mode=2;
          _datatopost.Data.Data_Input.Header=data;
          this.service.postPromise("/adm/CommenContext/Run", _datatopost).
          then((data) => {            
            deferred.resolve(data);        
            }).catch((err) => {
              deferred.reject(err);
          });      
          return deferred.promise;
        },  
        insert: ( values) => {
        let deferred: Deferred<any> = new Deferred<any>();     
        _datatopost.Data.Data_Input.Mode=1;
        _datatopost.Data.Data_Input.Header=values;
        this.service.postPromise("/adm/CommenContext/Run", _datatopost).
        then((data) => {            
          deferred.resolve(data);        
          }).catch((err) => {
            deferred.reject(err);
        });      
        return deferred.promise;
       }
        ,remove:(key)=> {
      let deferred: Deferred<any> = new Deferred<any>();   
      let row:any;
      _datatopost.Data.Data_Input.Mode=3;
      _datatopost.Data.Data_Input.Header=row;
      this.service.postPromise("/adm/CommenContext/Run", _datatopost).
      then((data) => {            
        deferred.resolve(data);        
        }).catch((err) => {
          deferred.reject(err);
      });      
      return deferred.promise; 
    },
      });
      
    };
  

  loadGrid(){
    let dataToPostBody:DataToPost = {
      'Data': {
        'SPName': '[CRM].[CRM_SpINVOICE_D]',
        'Data_Input': { 'Mode': 4,          
         'Header': {'INVOICE_D_INVOICE_H_ID':this.item
                     }
        , 'Detail': '', 'InputParams': '' }
      }
      
    }
  
    this.service.postPromise("/adm/CommenContext/Run", dataToPostBody).
    then((data) => {   
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
        this.DetailDataSource=data.ReturnData.Data_Output[0].Header;  
       }
       else {
        this.DetailDataSource=[];
       }     
    });
  
  
   };  

   rowRemove(e){
    this.detailData.emit(this.DetailDataSource);
    this.deletedData.emit(e.data);
   }

   setTotalPriceValue(newData, value, currentRowData) {
    newData.INVOICE_D_TARGET_PERCENT = value;
    if (currentRowData.INVOICE_D_CACH_PRICE )
      newData.INVOICE_D_FINAL_PRICE = +currentRowData.INVOICE_D_CACH_PRICE + ((currentRowData.INVOICE_D_CACH_PRICE * value)/100);
   }

   setCachPriceValue(newData, value, currentRowData) {
    newData.INVOICE_D_CACH_PRICE = value;
    if(currentRowData.INVOICE_D_TARGET_PERCENT)
      newData.INVOICE_D_FINAL_PRICE = +value + ((currentRowData.INVOICE_D_TARGET_PERCENT * value)/100);
   }

}
