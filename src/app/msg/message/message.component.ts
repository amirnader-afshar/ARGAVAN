import { Component, OnInit, ViewChild } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import {Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '../../shared/services/TranslateService';
import { Notify } from '../../shared/util/Dialog';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { PopupBasePage } from '../../shared/BasePage';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { CoreService } from "../../shared/services/CoreService";
import { FileExplorerInputConfig, fileExtensionConvertor, FileGroup } from "../../shared/components/fileExplorer/fileexplorer.util";
import { Dialog } from '../../shared/util/Dialog';
import { FileDto } from 'src/app/shared/components/fileExplorer/Dtos/fileDto';
import { FileExplorerService } from 'src/app/shared/components/fileExplorer/fileexplorer.service.proxy';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent extends PopupBasePage implements OnInit {

  menuItems = [
    {
      name: "save",
      icon: "fa fa-floppy-o green",
      text: 'ذخیره',
      visible: true
    },
    {
      name: "save_sent",
      text: 'ذخیره و ارسال',
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
  config: FileExplorerInputConfig = new FileExplorerInputConfig();
  AttachmentsFiles: FileDto = new FileDto();
  editItem: any = {};
  dataToPostBody: DataToPost;
  FilterCompanyCondition: any = { SUSR_CMPN_ID: null };
  Attachments;
  GRID_SOURCE;
  dataSource:any =[];
  CompanydataSource:any =[];

  constructor(private explorerService: FileExplorerService,public router: Router,private route: ActivatedRoute,public translate: TranslateService, public service: ServiceCaller,public core: CoreService,) { 
    super(translate); 
    this.route.queryParams.subscribe(params => {

      this.editItem.MSG_ID = params['MSG_ID'];
      this.GRID_SOURCE = params['GRID_SOURCE'];
      this.editItem.MSG_IN_OUT_TYPE = this.GRID_SOURCE;

  });
  }

  ngOnInit(): void {
    if (this.editItem.MSG_ID )
        this.loadmsg();
    this.loadCompanys();
  }

  onTemplateChange(e) {
    this.editItem.PUB_PRIORITY_ICON=e.PRIORITY_ICON
    
  }

  new(){
    this.editItem={};
    this.editItem.MSG_IN_OUT_TYPE = this.GRID_SOURCE;
    this.Attachments={};
    this.dataSource=[];
    this.loadCompanys();
  }
  loadCompanys(){

    this.dataToPostBody = {
      'Data': {
        'SPName': '[MSG].[MSG_SP_GET_RECIVER_COMPANYS]',
        'Data_Input': { 'Mode': 1,          
         'Header': ''
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.CompanydataSource=data.ReturnData.Data_Output[0].Header;
        
      }            
        });
   };

  loadmsg(){

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
        this.editItem=data.ReturnData.Data_Output[0].Header[0];
        this.Attachments=this.editItem.ATTACHMENTS;
      }   
      if (data.ReturnData.Data_Output[0].Detail.Detail!='is Empty') {
        this.dataSource = data.ReturnData.Data_Output[0].Detail;
      }       
        });
   };

  onCompanyChange(e) {
    console.log('FilterCompanyCondition',e);
    this.editItem.MSG_RECIVER_USER_ID = null;
    this.FilterCompanyCondition = {
      SUSR_CMPN_ID: e.ID
    };
  }
  ondataSourceRowRemoving(e)
  {
    var o =  {CMPN_NAM:e.data.MSG_RECIVER_CMPN_NAM
      ,SUSR_NAM_USR:e.data.MSG_RECIVER_SUSR_NAM_USR
      ,SUSR_ID:e.data.MSG_RECIVER_USER_ID
      ,CMPN_ID:e.data.MSG_RECIVER_CMPN_ID}
  
      const found = this.CompanydataSource.some(el => el.SUSR_ID === e.data.MSG_RECIVER_USER_ID);
      if (!found) {
        this.CompanydataSource.push(o); 
      }
  }

  ondataSourceSelectedDelete(e)
  {
    const that = this;
  
    e.data.forEach(function (arrayItem) {
      var o =  {CMPN_NAM:arrayItem.MSG_RECIVER_CMPN_NAM
        ,SUSR_NAM_USR:arrayItem.MSG_RECIVER_SUSR_NAM_USR
        ,SUSR_ID:arrayItem.MSG_RECIVER_USER_ID
        ,CMPN_ID:arrayItem.MSG_RECIVER_CMPN_ID}
    
        const found = that.CompanydataSource.some(el => el.SUSR_ID === arrayItem.MSG_RECIVER_USER_ID);
        if (!found) {
          that.CompanydataSource.push(o); 
        }
    });
  }
  valueChange(value) {
    this.editItem.MSG_BODY = value;
}
  onMenuItemClick(name) {

    if (name == "cancel") {
      if (this.GRID_SOURCE=='out')
        this.router.navigate(["msg/out-msg-list"]);
      else 
        this.router.navigate(["msg/in-msg-list"]);
      
    }
    else if (name == "save") {
      this.editItem.MSG_SENT = false;
      this.save();

    }
    else if (name=="save_sent")
    {
      this.editItem.MSG_SENT  = true;
      this.save();
    }
    else if (name=="Delete")
    {
      Dialog.confirm('آیا عملیات حذف را تایید می کنید؟').okay(() => {
        this.dataToPostBody = {
          'Data': {
            'SPName': 'MSG.MSG_Sp_MESSAGE',
            'Data_Input': { 'Mode': 3,          
             'Header': this.editItem  
            , 'Detail': {'Attachments':this.Attachments,'Recivers':this.dataSource}, 'InputParams': '' }
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
  fileExtensions(): string {
    let extensions = '';
    this.config.fileExtensions.forEach((item, index) => {
        extensions += fileExtensionConvertor(item) + ',';
    })
    if (extensions.endsWith(','))
        extensions.substr(extensions.length - 1);
    return extensions;
}
onChangeMain(e) {
  this.AttachmentsFiles.files = e.target.files;
  this.upload();
}

onAttachClick(e) {
  this.core.fileExplorer.open({ entityId: this.editItem.ID,tabelName:"MSG_MESSAGE"
        , fileGroup: FileGroup.msgAttachments,multipleModeDisable:true,enableSecurityMode:false}).then((data) => {
    this.Attachments=data;
    this.editItem.count_Attach=data.length;

  });    

}
onDeleteClick(id: any) {

  Dialog.confirm('تایید حذف', 'آیا مایل به حذف هستید؟').okay(() => {
    this.service.getPromise('/EDM/File/Delete', {id}).then(res => {
      Notify.success('فایل با موفقیت حذف شد');  
      let index = this.Attachments.findIndex(d => d.ID === id); //find index in your array
      this.Attachments.splice(index, 1);//remove element from array
        }).catch(err => {
            Notify.error('عملیات با خطا مواجه شد')
        });
    });
}
downloadFile(id) {
  debugger
  this.service.getfile("/EDM/File/Download?fileId=" + id, (data) => {

  });
}
upload(): void {        
  this.AttachmentsFiles.fileGroup = FileGroup.msgAttachments.toString();
  this.AttachmentsFiles.entityId = this.editItem.ID;
  this.AttachmentsFiles.tabelName = "MSG_MESSAGE";
  this.explorerService.uploadFile(this.AttachmentsFiles).then(res => {
      if (res!=null){
        console.log('res',res);
        console.log('attach',this.Attachments);
        this.Attachments=[...this.Attachments?.length?this.Attachments:[] ,...res.Result];
      }
          
  });  
}
  save()
  {
    if (!this.editItem.MSG_BODY){
      Notify.error('متن پیام نمی تواند خالی باشد!');
      return;
    }
    var mode = 1;
    if (this.editItem.MSG_ID)
      {
        mode=2;
      }
    var result = this.form.instance.validate();
    if (result.isValid) {
      console.log("this.editItem", this.editItem);
      this.dataToPostBody = {
      'Data': {
        'SPName': 'MSG.MSG_Sp_MESSAGE',
        'Data_Input': { 'Mode': mode,          
         'Header': this.editItem  
        , 'Detail': {'Attachments':this.Attachments,'Recivers':this.dataSource}, 'InputParams': '' }
      }
    };
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {                        
          console.log("return data", this.editItem);
          Notify.success('اطلاعات با موفقیت ذخیره شد');
          this.new();

        });
    } 
  }


  onAddAllClick(e){
    const that = this;
    let data : any=[];
    this.CompanydataSource.forEach(function (arrayItem) {
      var o =  {MSG_RECIVER_CMPN_NAM:arrayItem.CMPN_NAM
        ,MSG_RECIVER_SUSR_NAM_USR:arrayItem.SUSR_NAM_USR
        ,MSG_RECIVER_USER_ID:arrayItem.SUSR_ID
        ,MSG_RECIVER_CMPN_ID:arrayItem.CMPN_ID}
        const found = that.dataSource.some(el => el.MSG_RECIVER_USER_ID === arrayItem.SUSR_ID);
        if (!found) {
          data.push(o); 
        }
  });
  this.CompanydataSource=[];
  this.dataSource=[...this.dataSource,...data];
  }

 onAddClick(e){
  if (this.editItem.MSG_RECIVER_USER_ID){
        this.dataSource.push({MSG_RECIVER_CMPN_NAM:this.editItem.MSG_RECIVER_CMPN_NAM
                ,MSG_RECIVER_SUSR_NAM_USR:this.editItem.MSG_RECIVER_SUSR_NAM_USR
              ,MSG_RECIVER_USER_ID:this.editItem.MSG_RECIVER_USER_ID
            ,MSG_RECIVER_CMPN_ID:this.editItem.MSG_RECIVER_CMPN_ID})
        }
 }
 dblClick(e)
 {
  var o =  {MSG_RECIVER_CMPN_NAM:e.data.CMPN_NAM
    ,MSG_RECIVER_SUSR_NAM_USR:e.data.SUSR_NAM_USR
    ,MSG_RECIVER_USER_ID:e.data.SUSR_ID
    ,MSG_RECIVER_CMPN_ID:e.data.CMPN_ID}

    const found = this.dataSource.some(el => el.MSG_RECIVER_USER_ID === e.data.SUSR_ID);
    if (!found) {
      this.dataSource.push(o); 
      let index = this.CompanydataSource.findIndex(d => d.SUSR_ID === o.MSG_RECIVER_USER_ID); //find index in your array
      this.CompanydataSource.splice(index, 1);//remove element from array
    }
  
 }

}

