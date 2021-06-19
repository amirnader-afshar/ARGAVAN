import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '../../shared/BasePage';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import { Deferred } from '../../shared/Deferred';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { PermissionService } from '../../shared/permission';
import { CoreService } from "../../shared/services/CoreService";

import { FileExplorerInputConfig } from "../../shared/components/fileExplorer/fileexplorer.util";
import { DemisPopupService } from "../../shared/components/popup/demis-popup-service";
import { UploadPopupComponent } from "../../shared/components/fileExplorer/upload.popup";


import { Guid } from 'src/app/shared/types/GUID';
import { environment } from '../../../environments/environment';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { FileGroup } from "../../shared/components/fileExplorer/fileexplorer.util";
import { RouteData } from '../../shared/util/RouteData';
import { ConfigService } from 'src/app/shared/services/ConfigService';
import { LetterNoteListComponent } from '../letter-note-list/letter-note-list.component';
import { LettrtErjaatComponent } from "../lettrt-erjaat/lettrt-erjaat.component";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Dialog } from '../../shared/util/Dialog';
import { runInThisContext } from 'node:vm';

@Component({
  selector: 'app-root-outLetter',
  templateUrl: './outLetter.component.html',
  styleUrls: ['./outLetter.component.scss']
})
export class outLettercomponent extends BasePage implements OnInit {
  
  
  config: FileExplorerInputConfig = new FileExplorerInputConfig();
  
  FilterCompanyCondition: any = { SUSR_CMPN_ID: null };
  menuItems = [];
  ALLOW_PRG_UFIF_001;
  OFA_AUTO_BOOK_NO;
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  GRID_SOURCE;
  constructor(public translate: TranslateService
            , public router: Router,
            private route: ActivatedRoute
            , public service: ServiceCaller
            ,public permissionService: PermissionService,
            public core: CoreService,
            public popup: DemisPopupService,
            private routeData: RouteData, private confService: ConfigService,
            ) {
    super(translate);

    this.route.queryParams.subscribe(params => {

      this.editItem.LETTER_ID = params['LETTER_ID'];
      this.GRID_SOURCE = params['GRID_SOURCE'];

  });
     
   this.menuItems=[ {
      name: "save",
      icon: "fa fa-floppy-o green",
      text: ' ذخیره پیشنویس',
      visible:  true
    },
    {
      name: "save_sent",
      icon: "fa fa-floppy-o green",
      text: ' ذخیره و ارجاع',
      visible: true
    },
    {
      name: "cancel",
      text: 'انصراف',
      icon: "fa fa-ban red",
      visible: true
    },{
      name: "history",
      text: 'تاریخچه',
      icon: "fa fa-history",
      visible: true}
    ]
      if(this.editItem.LETTER_ID)
      {
        this.loadLetter();
      }
   }

  public hidePdfViewer = false;

  private _language = 'fa';

  public get language(): string {
    return this._language;
  }
  public set language(language: string) {
    this._language = language;
    this.hidePdfViewer = true;
    // the timeout gives the PDF viewer time
    // to free memory
    setTimeout(() => {
      this.hidePdfViewer = false;
    }, 1000);
  }

  ngOnInit() {
    this.editItem.LETTER_IN_OUT_TYPE = this.route.snapshot.data["LETTER_IN_OUT_TYPE"];
    this.editItem.FolderID = Guid.empty;    
    this.OFA_AUTO_BOOK_NO = Boolean(JSON.parse(this.confService.get('OFA-AUTO-BOOK-NO')));
    if (this.OFA_AUTO_BOOK_NO && !this.editItem.LETTER_ID ) {
     this.confService.reload().then(() => {
      this.editItem.LETTER_BOOK_NUMBER =this.confService.get('OFA-BOOK-PREFIX')
                                          +this.confService.get('OFA-LAST-FREE-NO')
                                          +this.confService.get('OFA-BOOK-SUFFIX')
    
           })
                            
      }

       

    // let deferred: Deferred<any> = new Deferred<any>();
    // this.ALLOW_PRG_UFIF_001 = this.permissionService.hasDefined('PRG_UFIF_001');//چک دسترسی به ویرایش قسمت کاست و تلرانس
    // this.service.get("/PRG/USER_FURTHER_INFORMATION/List", (data) => {
    //   if (data != null)
    //     this.editItem = data;
    //   console.log("editItem---->" + JSON.stringify(this.editItem));
    //   deferred.resolve(data);
    // }, this.filter);
  }

  loadLetter(){
    this.editItem.LOAD_MAIN_FILE=true;
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
        this.editItem=data.ReturnData.Data_Output[0].Header[0];  
        if(this.editItem.LETTER_IS_SENT && this.editItem.LETTER_AM_I_ERJA==false){
          this.menuItems[1].visible=false;
          this.menuItems[0].visible=false;       
        }
      }
      
    });


   };


  filter: any = {};
  editItem: any = {};
  Attachments:any={};
  Notes:any={};
  dataToPostBody: DataToPost;


  onMenuItemClick(name) {

    if (name == "cancel") {
      if (this.GRID_SOURCE=='out')
        this.router.navigate(["ofa/outLetters"]);
      else 
        this.router.navigate(["ofa/inLetters"]);
    }
    if (name == "save") {        
          this.Save(this.editItem.LETTER_IS_SENT?true:false  ,this.editItem.LETTER_ID?2:1)    
    }
    if (name == "history"){
      this.routeData.push('ofa_outLetter',this.editItem);
      this.router.navigate(["ofa/letterHistory"], { queryParams: { fieldValue: this.editItem.LETTER_ID
                                                                    ,spName:"ofa.OFA_Sp_letter"
                                                                  ,fieldName:"LETTER_ID"
                                                                  ,letterType:this.GRID_SOURCE 
                                                                  }
                                                  }
                          );
    }
    if (name=="save_sent"){
      if (this.editItem.LETTER_IN_OUT_TYPE=='out')
        if(!this.editItem.LETTER_RECIVER_CMPN_ID||!this.editItem.LETTER_RECIVER_USER_ID)
          {
            Notify.error('!سازمان گیرنده و کاربر گیرنده را انتخاب کنید');
            return; 
          }

      Dialog.confirm('تایید ارجاع', 'آیا مایل به ثبت تغییرات و ارجاع نامه هستید؟').okay(() => {
        this.Save(true,this.editItem.LETTER_ID?2:1)  
        
        });    
      
    }
  }
  Save(isSent: Boolean,mode :number){
    if (!this.editItem.LETTER_MAIN_FILE_ID)
    {
      Notify.error('!تصویر نامه را بارگزاری کنید');
      return;
    }
  var result = this.form.instance.validate();
  if (result.isValid) 
  {
    this.editItem.LETTER_IS_SENT=isSent;
    this.dataToPostBody = {
      'Data': {
        'SPName': '[OFA].[OFA_Sp_letter]',
        'Data_Input': { 'Mode': mode,          
         'Header': { 
        'LETTER_ID':this.editItem.LETTER_ID,
        'LETTER_CMPN_ID': this.editItem.LETTER_CMPN_ID,
        'LETTER_TITEL': this.editItem.LETTER_TITEL,          
        'LETTER_BOOK_NUMBER':  this.editItem.LETTER_BOOK_NUMBER,
        'LETTER_BOOK_DATE':  this.editItem.LETTER_BOOK_DATE,
        'LETTER_NUMBER': this.editItem.LETTER_NUMBER,
        'LETTER_DATE': this.editItem.LETTER_DATE,
        'LETTER_RECIVER_CMPN_ID': this.editItem.LETTER_RECIVER_CMPN_ID,
        'LETTER_RECIVER_USER_ID': this.editItem.LETTER_RECIVER_USER_ID,
        'LETTER_MAIN_FILE_ID':this.editItem.LETTER_MAIN_FILE_ID,
        'LETTER_ARGHAVAN_TIME_STAMP':this.editItem.LETTER_ARGHAVAN_TIME_STAMP,
        'LETTER_DESC':this.editItem.LETTER_DESC,
        'LETTER_IN_OUT_TYPE':this.editItem.LETTER_IN_OUT_TYPE,
        'LETTER_IS_SENT':  this.editItem.LETTER_IS_SENT,
        'LOAD_MAIN_FILE':true}
        , 'Detail': {'Attachments':this.Attachments,'Notes':this.Notes}, 'InputParams': '' }
      }
    };
    
    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {
      this.editItem=data.ReturnData.Data_Output[0].Header[0];     
      // if (data.ReturnData.Data_Output[0].Header[0].ID)
      // {
      //   this.editItem.LETTER_ID=data.ReturnData.Data_Output[0].Header[0].ID;
      //   this.editItem.LETTER_ARGHAVAN_TIME_STAMP= data.ReturnData.Data_Output[0].Header[0].LETTER_ARGHAVAN_TIME_STAMP;
      //   this.editItem.LETTER_AM_I_ERJA=data.ReturnData.Data_Output[0].Header[0].LETTER_AM_I_ERJA;
      // }
      console.log("return data", this.editItem.LETTER_ID);
      if(isSent && this.editItem.LETTER_AM_I_ERJA==false){
        this.menuItems[1].visible=false;
        this.menuItems[0].visible=false;       
      }
      Notify.success('اطلاعات با موفقیت ذخیره شد');
    });
  }
  }

  valueChange_DatePicker(e, cell) {
    console.log('valueChange_DatePicker', e)
    console.log('editItem', this.editItem)
    
}

onCompanyChange(e) {
  console.log('FilterCompanyCondition',e);
  this.FilterCompanyCondition = {
    SUSR_CMPN_ID: e.ID
  };
}


onAttachClick(e) {
  this.core.fileExplorer.open({ entityId: this.editItem.ID,tabelName:"OFA_LETTER"
        , fileGroup: FileGroup.ofaAttachments,multipleModeDisable:true,enableSecurityMode:false}).then((data) => {
    this.Attachments=data;
    this.editItem.count_Attach=data.length;

  });    

}

uploadfile(e) {
  this.config.fileGroup=FileGroup.ofaMainFile;
  this.config.multipleModeDisable=true;
  this.config.enableSecurityMode=false;
  this.popup.open(UploadPopupComponent, {
    title: 'بارگذاری فایل',
    data: {
        entityId: this.editItem.LETTER_ID,
        folderid: this.editItem.FolderID,        
        ...this.config
    } //TODO add entity id from explorer
}).then(res => {
  console.log(res);
  this.editItem.LETTER_MAIN_FILE_ID = res.Result[0].ID;
  this.editItem.MainFilePatch=environment.url+res.Result[0].Patch;
  this.editItem.FILE_BASE64STRING=res.Result[0].FILE_BASE64STRING;
  
})
}

showNote(e) {
  
  this.popup.open(LetterNoteListComponent, {
    title: 'یادداشتها',
    width:"60%",
    height:"70%",
    data: {
        entityId: this.editItem.LETTER_ID,
        tabelName:'OFA_LETTER'
    } //TODO add entity id from explorer
}).then(res => {
  this.Notes=res;
  this.editItem.count_Notes=res.length;
  
})
}

showErjaat(e){
  this.popup.open(LettrtErjaatComponent, {
    title: 'ارجاعات',
    width:"60%",
    height:"70%",
    data: {
        entityId: this.editItem.LETTER_ID,
        tabelName:'OFA_LETTER'
    } //TODO add entity id from explorer
}).then(res => {
  this.Notes=res;
  this.editItem.count_Notes=res.length;
  
}) 
}


showGrafErjaat(){
  this.routeData.push('ofa_outLetter',this.editItem);
  this.router.navigate(["ofa/letterErjaatGraph"],{ 
                              queryParams: {letterType:this.GRID_SOURCE
                                                  }
}); 
}

}
