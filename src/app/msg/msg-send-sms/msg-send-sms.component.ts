import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxListComponent, DxValidationGroupComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import dxList from 'devextreme/ui/list';

import { DataToPost } from 'src/app/shared/services/data-to-post.interface';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';
import { SmsService } from 'src/app/shared/services/SmsService';
import { TranslateService } from 'src/app/shared/services/TranslateService';
import { Dialog, Notify } from 'src/app/shared/util/Dialog';
import { RouteData } from 'src/app/shared/util/RouteData';

@Component({
  selector: 'app-msg-send-sms',
  templateUrl: './msg-send-sms.component.html',
  styleUrls: ['./msg-send-sms.component.scss']
})
export class MsgSendSmsComponent implements OnInit {

  constructor(private translate: TranslateService,public router: Router,public service: ServiceCaller,private route: ActivatedRoute
    ,private routeDate: RouteData,private smsservise:SmsService) {
    this.route.queryParams.subscribe(params => {
      this.editItem.SMSH_ID = params['SMSH_ID'];
  });
    
    this.editItem.SMS_RACIVERS = this.routeDate.pop('SMS_RACIVERS') ;
    var _data:any =[]
    if (this.editItem.SMS_RACIVERS)
      {
        _data=this.editItem.SMS_RACIVERS
      }
    this.recivers_dataSource = new DataSource({
      store: new ArrayStore({
        key: 'ID',
        data: _data
      }),
    });
          

        
   }
  menuItems = [
    {
      name: "save",
      icon: "fa fa-floppy-o green",
      text: 'ذخیره',
      visible: true
    },
    {
      name: "save_sent",
      text: 'ذخیره و ارسال پیامک',
      icon: "fa fa-floppy-o green",
      visible: true
    },
    {
      name: "Delete",
      icon: "fa fa-trash red",
      text: 'حذف',
      visible: true
    }
    ,
    {
      name: "cancel",
      text: 'انصراف',
      icon: "fa fa-ban red",
      visible: true
    },
 
  ];
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  @ViewChild('reciverForm',{static: false}) reciverForm: DxValidationGroupComponent;
  @ViewChild('listRecivers',{static: false}) listRecivers: DxListComponent;
  editItem: any = {};
  reciver: any = {};
  dataToPostBody: DataToPost;
  
  
  recivers_dataSource:any =[];   
  detail_dataSource:any =[];
  phonePattern: any =  "09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}"
  phoneRules = [{
    type: 'required',
    message: this.translate.instant("PUB_REQUIRED")
  },
  {
    type: 'pattern',
    pattern: this.phonePattern,
    message: this.translate.instant("ADM_PHONE_INVALID")
  }];


  ngOnInit(): void {
    if (this.editItem.SMSH_ID){
      this.loadsms();
    }
    this.editItem.SMSH_DATA = this.routeDate.pop('SMS_STATIC_DATA') ;    

   
    
  }

  loadsms(){
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
        this.editItem=data.ReturnData.Data_Output[0].Header[0];
        this.recivers_dataSource = new DataSource({
          store: new ArrayStore({
            key: 'ID',
            data: this.editItem.SMS_RACIVERS
          }),
        });
        
      }   
      if (data.ReturnData.Data_Output[0].Detail.Detail!='is Empty') {
        this.detail_dataSource = data.ReturnData.Data_Output[0].Detail;
      }       
        });
   };
   onMenuItemClick(name) {

    if (name == "cancel") {

        this.router.navigate(["msg/sms-list"]);
      
    }
    else if (name == "save") {
      
      this.save();

    }
    else if (name=="save_sent")
    {      
      this.save();
      
      var items = this.recivers_dataSource.store()._array;
      
      if (items.length>0)
      {
          let  _numbers: string[] = []
          let _smsText: string[] = []
          for (let i = 0; i < items.length; i++) {
            _numbers.push(items[i]['Mobile']);
            _smsText.push(items[i]['smsBody']);
            }

            this.smsservise.sendSms(_numbers,_smsText).then(data=>{
              Notify.success('پیامک / ها ارسال شد');
            })
        }
    }
    else if (name=="Delete")
    {
      Dialog.confirm('آیا عملیات حذف را تایید می کنید؟').okay(() => {
        this.dataToPostBody = {
          'Data': {
            'SPName': 'MSG.MSG_Sp_SMS_HEADER',
            'Data_Input': { 'Mode': 3,          
             'Header': this.editItem  
            , 'Detail': {}, 'InputParams': '' }
          }
        };
          this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
            then((data) => {                        
              console.log("return data", this.editItem);
              Notify.success('اطلاعات با موفقیت حذف شد');
              this.onMenuItemClick('cancel') ;
            });

        
        });    
    }

  }   
  save()
  {
    if ( this.recivers_dataSource.store()._array.length==0){
      Notify.error('لطفا حداقل یک گیرنده پیام ثبت کنید !');
      return;
    }
    var mode = 1;
    if (this.editItem.SMSH_ID)
      {
        mode=2;
      }
    var result = this.form.instance.validate();
    if (result.isValid) {
      // this.editItem.SMSH_DATA = this.data_dataSource;
      this.editItem.SMSH_RECIVER_NUMBERS = this.recivers_dataSource.store()._array;
      console.log("this.editItem", this.editItem);
      this.dataToPostBody = {
      'Data': {
        'SPName': 'MSG.MSG_Sp_SMS_HEADER',
        'Data_Input': { 'Mode': mode,          
         'Header': this.editItem  
        , 'Detail': {}, 'InputParams': '' }
      }
    };
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {                        
          console.log("return data", this.editItem);
          Notify.success('اطلاعات با موفقیت ذخیره شد');
          if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
            this.editItem=data.ReturnData.Data_Output[0].Header[0];
            
          }   
          if (data.ReturnData.Data_Output[0].Detail.Detail!='is Empty') {
            // this.dataSource = data.ReturnData.Data_Output[0].Detail;
          } 
        });
    } 
  }  
  onTemplateChange(e)
  {
    console.log(e);
    this.editItem.SMSH_TEMPLATE = e.BODY;
    
  }

  addNumber()
  {
    var result = this.reciverForm.instance.validate();
      if (result.isValid) {
        this.recivers_dataSource.store().insert({Name:this.reciver.SMSD_NAM
                ,Mobile:this.reciver.SMSD_NUMBER});
        this.recivers_dataSource.reload();                
        }
  }
  makeSmsDetail(){
    
      var items = this.recivers_dataSource.store()._array;
        if (items.length>0)
        {
        for (let i = 0; i < items.length; i++) {
          var body = this.editItem.SMSH_TEMPLATE;
          for (let key of Object.keys(items[i])) {
            let value = items[i][key];            
            body = body.replaceAll('[#'+key+']', value);
          }
          if (this.editItem.SMSH_DATA){
            for (let key of Object.keys(this.editItem.SMSH_DATA)) {
              let value = this.editItem.SMSH_DATA[key];            
              body = body.replaceAll('[$'+key+']', value);
            }
          }
          items[i]['smsBody']=body;
        } 
      }
  }
}
