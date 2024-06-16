import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from 'src/app/shared/Deferred';
import { PermissionService } from 'src/app/shared/permission';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';
import { Guid } from 'src/app/shared/types/GUID';

@Component({
  selector: 'crm-invoice-d-subdetail',
  templateUrl: './invoice-d-subdetail.component.html',
  styleUrls: ['./invoice-d-subdetail.component.scss']
})
export class InvoiceDSubdetailComponent implements OnInit {

  @Output() subDetailData : EventEmitter<any>= new EventEmitter<any>();
  @Output() subDeletedData : EventEmitter<any>= new EventEmitter<any>();

 


  private _rowData: string;
    
  @Input() set rowData(value: string) {
  
     this._rowData = value;

     this.subDetailDataSource = this.MakeDatasource(this.service,'[CRM].[CRM_SpINVOICE_D_SUBDETAIL]',this._rowData);
  
  }
  
  get rowData(): string {
  
      return this._rowData;
  
  }


  @ViewChild('subDetailGrid',{static: false}) subDetailGrid: DxDataGridComponent;

  subDetailDataSource : any = {};
  SubDetailGridValue;


  INVOICE_D_CACH_PRICE;
  INVOICE_D_TARGET_PERCENT;
  INVOICE_D_FINAL_PRICE;
  INVOICE_D_MIN_ORDER;
  INVOICE_D_EXPIRE;
  INVOICE_D_VALIDATE;
  INVOICE_D_PREPER;
  INVOICE_D_SITE_PRICE;

  constructor(public service: ServiceCaller,public permissionService: PermissionService) {
    this.INVOICE_D_CACH_PRICE =this.permissionService.hasDefined('INVOICE_D_CACH_PRICE');
    this.INVOICE_D_TARGET_PERCENT =this.permissionService.hasDefined('INVOICE_D_TARGET_PERCENT');
    this.INVOICE_D_FINAL_PRICE =this.permissionService.hasDefined('INVOICE_D_FINAL_PRICE');
    this.INVOICE_D_MIN_ORDER =this.permissionService.hasDefined('INVOICE_D_MIN_ORDER');
    this.INVOICE_D_EXPIRE =this.permissionService.hasDefined('INVOICE_D_EXPIRE');
    this.INVOICE_D_VALIDATE =this.permissionService.hasDefined('INVOICE_D_VALIDATE');
    this.INVOICE_D_PREPER =this.permissionService.hasDefined('INVOICE_D_PREPER');
    this.INVOICE_D_SITE_PRICE =this.permissionService.hasDefined('INVOICE_D_SITE_PRICE');

    

   }

  ngOnInit(): void {
    console.log('rowdata',this.rowData);
    
  }

  onSaving(e){
    // this.subDetailData.emit(this.subDetailDataSource);
  }

  rowRemove(e){
    // this.subDetailData.emit(this.subDetailDataSource);
    // this.subDeletedData.emit(e.data);
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


   MakeDatasource(ser:ServiceCaller,SPName:string,_rowData){
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
          _datatopost.Data.Data_Input.Header={'INVOICE_D_SUBDETAIL_INVOICE_D_ID':_rowData.ID};
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
        
          row = this.subDetailGrid.instance.getDataSource().items().filter(c => c.ID == key)[0];

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
        _datatopost.Data.Data_Input.Header={...values,'INVOICE_D_SUBDETAIL_INVOICE_D_ID':_rowData.ID,'INVOICE_D_SUBDETAIL_INVOICE_H_ID':_rowData.INVOICE_D_INVOICE_H_ID};

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
  



}
