import {  Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '@pdftron/webviewer';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from 'src/app/shared/Deferred';
import { PermissionService } from 'src/app/shared/permission';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';
import { DataToPost } from 'src/app/shared/services/data-to-post.interface';
import { Guid } from 'src/app/shared/types/GUID';
import { Dialog, Notify } from 'src/app/shared/util/Dialog';


@Component({
  selector: 'app-crm-invoice',
  templateUrl: './crm-invoice.component.html',
  styleUrls: ['./crm-invoice.component.scss'],
})
export class CrmInvoiceComponent implements OnInit {

  editItem: any = {};
  invoice_h_d_Data: any = {};
  invoice_h_deleted_Data: any = [];
  acc_state_lookupData :any ={};
  acc_city_lookupData :any ={};

  accgridDataSource: any = {};
  SELLMANgridDataSource: any = {};

  selectedACCgridBoxValue;
  CRM_ACC_INSERT; 
  CRM_ACC_DELETE; 
  CRM_ACC_UPDATE; 

  CRM_SELLMAN_INSERT; 
  CRM_SELLMAN_DELETE; 
  CRM_SELLMAN_UPDATE; 


  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  @ViewChild('ACCgrid',{static: false}) ACCgrid: DxDataGridComponent;
  @ViewChild('SELLMANgrid',{static: false}) SELLMANgrid: DxDataGridComponent;
  //@ViewChild('INVOICEgrid',{static: false}) INVOICEgrid: DxDataGridComponent;

  isGridBoxOpened = false;
  isSELLMANGridBoxOpened = false;


  ngOnInit(): void {

    this.CRM_ACC_INSERT = this.permissionService.hasDefined('CRM_ACC_INSERT');
    this.CRM_ACC_DELETE = this.permissionService.hasDefined('CRM_ACC_DELETE');
    this.CRM_ACC_UPDATE = this.permissionService.hasDefined('CRM_ACC_UPDATE');

    this.CRM_SELLMAN_INSERT = this.permissionService.hasDefined('CRM_SELLMAN_INSERT');
    this.CRM_SELLMAN_DELETE = this.permissionService.hasDefined('CRM_SELLMAN_DELETE');
    this.CRM_SELLMAN_UPDATE = this.permissionService.hasDefined('CRM_SELLMAN_UPDATE');

    if (this.editItem.INVOICE_H_ID){

      this.loadData();
    }
  }

  menuItems = [    
    {
    name: "save",
    icon: "fa fa-floppy-o green",
    text: 'ذخیره',
    visible: true
    },
    {
      name: "Delete",
      icon: "fa fa-trash red",
      text: 'حذف',
      visible: true
    }
  ]

  call_CRM_SpINVOICE_H(mode :number)
  {
    let dataToPostBody  = {
      'Data': {
        'SPName': 'CRM.CRM_SpINVOICE_H',
        'Data_Input': { 'Mode': mode,          
         'Header': this.editItem  
        , 'Detail':  this.invoice_h_d_Data
        ,'DeletedDetail':this.invoice_h_deleted_Data
        , 'InputParams': '' }
      }
    };
      this.service.postPromise("/adm/CommenContext/Run", dataToPostBody).
        then((data) => {                        
                 
          if (mode!=3)
            Notify.success('اطلاعات با موفقیت ذخیره شد');
          else             
              Notify.success('اطلاعات با موفقیت حذف شد');
        
        this.router.navigate(["crm/invoiceList"]);
            
        });
  }

  onMenuItemClick(name) {

    if (name == "Delete") {
      Dialog.delete().done(() => {
        this.call_CRM_SpINVOICE_H(3); 
        });
      }
       
    if (name == "save") {
      var result = this.form.instance.validate();
      if (result.isValid) {        
        var mode = 1;
        if (this.editItem.INVOICE_H_ID)
          {
            mode=2;
          }
        this.call_CRM_SpINVOICE_H(mode);  
          }           

      }

    }
  OndetailDataChange(childData: any){
    console.log('childData',childData)
    this.invoice_h_d_Data = childData;
    }


    OndetailDaleteChange(deletedData){
     
      this.invoice_h_deleted_Data.push(deletedData);
      console.log('deletedData', this.invoice_h_deleted_Data) 
      //Object.assign(this.invoice_h_deleted_Data, deletedData);
      //this.invoice_h_deleted_Data = deletedData;

    }


  SELLMANgridBox_displayExpr = (e) =>{
    
    var exp =e.SELLMAN_TITEL + " (" + e.SELLMAN_CODE + ")"
    return exp;
    }
    ;
  
  gridBox_displayExpr = (e) =>{
    
    var exp =e.ACC_NAME + " (" + e.ACC_CLIENT_CODE + ")"
    return exp;
    }
    ;


  constructor( public service: ServiceCaller,public route: ActivatedRoute,public router: Router
    ,public permissionService: PermissionService
  ) { 


    this.loadLocations();
    
    this.accgridDataSource = this.MakeDatasource(service,'[CRM].[CRM_SpACC]');
    
    this.SELLMANgridDataSource = this.MakeDatasource(service,'[CRM].[CRM_SpSELLMAN]');

    this.getFilteredCities = this.getFilteredCities.bind(this);

    this.route.queryParams.subscribe(params => {

      this.editItem.INVOICE_H_ID = params['INVOICE_H_ID'];


  });

  }

  ////SELMAN GRID CONFIC

  onSELLMANGridBoxOptionChanged(e) {
    if (e.name === 'value') {
      if (Array.isArray( e.value))
        this.editItem.INVOICE_H_EXPERT_ID=e.value[0];
      this.isSELLMANGridBoxOpened = false;      

    }
  }
/////////////////////

  setStateValue(this, newData, value: number, currentRowData) {
    newData.ACC_CITY = null;
    this.defaultSetCellValue(newData, value, currentRowData);
  }


  onEditorPreparing(e) {
    if (e.parentType === 'dataRow' && e.dataField === 'ACC_CITY') {
      e.editorOptions.disabled = e.row.data.ACC_STATE === undefined;
    }
  }

  getFilteredCities(options: { data }) {
    return {
      store: this.acc_city_lookupData,
      filter: options.data ? ['Loca_Loca_Id', '=', options.data.ACC_STATE] : null,
    };
  }


  loadLocations(){
    let _datatopost={
      'Data': {
        'SPName':'[PUB].[PUB_Sp_location_select]',
        'Data_Input': {           
         'Header': {}
        , 'Detail': '', 'InputParams': '' }
      }
      
    }
    this.service.postPromise("/adm/CommenContext/Run", _datatopost).
        then((data) => {   
          if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
            console.log('acc_state_lookupData',data.ReturnData.Data_Output[0].Header)             
            this.acc_state_lookupData=data.ReturnData.Data_Output[0].Header;
            this.acc_city_lookupData=data.ReturnData.Data_Output[0].Detail;
           } else
           {
            
           }    
        });
  };

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
        if (_datatopost.Data.SPName==='[CRM].[CRM_SpACC]')  {    
           row = this.ACCgrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
        }         
        else if (_datatopost.Data.SPName==='[CRM].[CRM_SpSELLMAN]')  {    
          row = this.SELLMANgrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
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
    if (_datatopost.Data.SPName==='[CRM].[CRM_SpACC]')  {        
      row = this.ACCgrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
    } 
   else if (_datatopost.Data.SPName==='[CRM].[CRM_SpSELLMAN]')  {    
     row = this.SELLMANgrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
    }   
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




  loadData(){

    let _datatopost= {
      'Data': {
        'SPName': '[CRM].[CRM_SpINVOICE_H]',
        'Data_Input': { 'Mode': 4,          
         'Header': this.editItem
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", _datatopost).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.editItem=data.ReturnData.Data_Output[0].Header[0];
      }            
        });
   };

  onGridBoxOptionChanged(e) {
    if (e.name === 'value') {
      if (Array.isArray( e.value))
        this.editItem.INVOICE_H_ACC_ID=e.value[0];
      
      this.isGridBoxOpened = false;      
    }
  }

  onErjaClick(e)
  {
    
  }


}
