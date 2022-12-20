import { AfterViewInit, Component, OnInit, ViewChild,ElementRef } from '@angular/core';
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
import { Dialog } from '../../shared/util/Dialog';
import   { WebViewerInstance }  from '@pdftron/webviewer';
import ArrayStore from 'devextreme/data/array_store';
import CustomStore from 'devextreme/data/custom_store';
import {DocumenteEditorComponent} from './documente-editor/documente-editor.component'
import dxTagBox from 'devextreme/ui/tag_box';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root-outLetter',
  templateUrl: './outLetter.component.html',
  styleUrls: ['./outLetter.component.scss'],
})
export class outLettercomponent extends BasePage implements OnInit,AfterViewInit {

  
  
  config: FileExplorerInputConfig = new FileExplorerInputConfig();
  docReadOnly : Boolean;  
  FilterCompanyCondition: any = { SUSR_CMPN_ID: null };
  menuItems = [];
  ALLOW_PRG_UFIF_001;
  OFA_AUTO_BOOK_NO;
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  @ViewChild('viewer',{static: false}) vieweRef: ElementRef;
  @ViewChild(DocumenteEditorComponent) childcmp:DocumenteEditorComponent;
  
  GRID_SOURCE;
  user;
  allcategoryItems: any[];
  categoryselected: string[]=[];
  categoryDataSource: any = {};
  CompanydataSource:any =[];
  reciversDataSource:any =[];
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
      this.editItem.archive = params['archive'];
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
      text: 'ارسال نامه',
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
      ,{
        name: "archive",
        text: 'انتقال به آرشیو',
        icon: "fa fa-archive",
        visible: true}
        ,{
          name: "cancelSent",
          text: 'لغو ارجاع',
          icon: "fa fa-hand-paper-o",
          visible: true}
    ]
      if(this.editItem.LETTER_ID)
      {
        this.loadLetter();
      }

      this.loadCategory();
              
   }

   dblClick(e)
   {
      const found = this.reciversDataSource.some(el => el.SUSR_ID === e.data.SUSR_ID);
      if (!found) this.reciversDataSource.push(e.data); 
   }

   onAddAllClick(e){
    let data : any=[];
    this.CompanydataSource.forEach(function (arrayItem) {    
    data.push(arrayItem); 
  });
  this.reciversDataSource=[];
  this.reciversDataSource=data;
  }
   loadCompanys(){

    this.dataToPostBody = {
      'Data': {
        'SPName': '[OFA].[OFA_SP_GET_RECIVER_COMPANYS_USERES]',
        'Data_Input': { 'Mode': 1,          
         'Header': {LETTER_ID:this.editItem.LETTER_ID}
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.CompanydataSource=data.ReturnData.Data_Output[0].Header;
        let Detail;
        if (data.ReturnData.Data_Output[0].Detail.Detail!='is Empty') {
            Detail = data.ReturnData.Data_Output[0].Detail;
            this.CompanydataSource = [ ...this.CompanydataSource, ...Detail];  
        }   

      }            
        });
   };

   loadCategory(){
    this.dataToPostBody = {
      'Data': {
        'SPName': '[OFA].[OFA_Sp_CATEGORY]',
        'Data_Input': { 'Mode': 4,          
         'Header': this.editItem
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.categoryDataSource=data.ReturnData.Data_Output[0].Header; 
        this.allcategoryItems = this.categoryDataSource.map(function(a) {return a.CATEGORY_CAPTION;});               
      }
      
    });

    this.dataToPostBody = {
      'Data': {
        'SPName': '[OFA].[OFA_Sp_LETTER_CATEGORY_USED_SELECT]',
        'Data_Input': { 'Mode': 0,          
         'Header': this.editItem
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        let ret=data.ReturnData.Data_Output[0].Header; 
        this.categoryselected = ret.map(function(a) {return a.CATEGORY_CAPTION;});               
      }
      
    });

   }
   onSelectionChanged(args) {
    
    for (let i = 0; i < args.addedItems.length; i++)
     { 
      this.categoryselected.push(args.addedItems[i])
     }
     for (let i = 0; i < args.removedItems.length; i++)
    {
      this.categoryselected = this.categoryselected.filter(item => item !== args.removedItems[i])
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

  wvinstance :WebViewerInstance;
  ngAfterViewInit():void{
    //  Webviewer({
    //    path:'../assets/lib',
    //    initialDoc: ''
    //  },this.vieweRef.nativeElement).then(instance=> {
    //   this.wvinstance = instance;
    //   // 'http://localhost:5577/Temp/53ce85a2-c1db-44fb-9233-b28697fe3761.pdf'
    //     instance.loadDocument(environment.url+this.editItem.FILE_PATH,{
         

    //     })
    //     instance.setTheme('dark');
    //  })
  }  
  
  getBookNumber()
  {
    this.OFA_AUTO_BOOK_NO = Boolean(JSON.parse(this.confService.get('OFA-AUTO-BOOK-NO')));
    if (this.OFA_AUTO_BOOK_NO && !this.editItem.LETTER_ID ) {
     this.confService.reload().then(() => {
      this.editItem.LETTER_BOOK_NUMBER =this.confService.get('OFA-BOOK-PREFIX')
                                          +this.confService.get('OFA-LAST-FREE-NO')
                                          +this.confService.get('OFA-BOOK-SUFFIX')
    
           })
                            
      }
  }

  new(){    
    this.editItem={LETTER_IN_OUT_TYPE:this.editItem.LETTER_IN_OUT_TYPE
                  ,FolderID:Guid.empty,LETTER_BOOK_DATE:this.editItem.LETTER_BOOK_DATE
                  ,LETTER_DATE:this.editItem.LETTER_DATE}
    this.reciversDataSource=[];  
    this.getBookNumber();                  
  }

  ngOnInit() {
    this.editItem.LETTER_IN_OUT_TYPE = this.route.snapshot.data["LETTER_IN_OUT_TYPE"];
    this.editItem.FolderID = Guid.empty;    
    this.getBookNumber();
    this.loadCompanys();
   
    // let deferred: Deferred<any> = new Deferred<any>();
    // this.ALLOW_PRG_UFIF_001 = this.permissionService.hasDefined('PRG_UFIF_001');//چک دسترسی به ویرایش قسمت کاست و تلرانس
    // this.service.get("/PRG/USER_FURTHER_INFORMATION/List", (data) => {
    //   if (data != null)
    //     this.editItem = data;
    //   console.log("editItem---->" + JSON.stringify(this.editItem));
    //   deferred.resolve(data);
    // }, this.filter);
  }
  downloadFile(id) {
    
    this.service.getfile("/EDM/File/Download?fileId=" + id, (data) => {

    });
  }
  loadLetter(){
    this.editItem.LOAD_MAIN_FILE=true;
    this.dataToPostBody = {
      'Data': {
        'SPName': '[OFA].[OFA_SP_LETTER_GET]',
        'Data_Input': { 'Mode': 0,          
         'Header': this.editItem
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.editItem=data.ReturnData.Data_Output[0].Header[0];  
        // this.reciversDataSource =  [ ...this.editItem.LETTER_CMPNY_RECIVERS_DATA? this.editItem.LETTER_CMPNY_RECIVERS_DATA:[]
        //     , ...this.editItem.LETTER_NONE_CMPNY_RECIVERS_DATA?this.editItem.LETTER_NONE_CMPNY_RECIVERS_DATA:[]];  

        this.childcmp.openDocument(this.editItem.FILE_PATH,this.editItem.FILE_NAME).then(
          data => {
            this.childcmp.updateDocFields('{number}',this.editItem.LETTER_BOOK_NUMBER);
            this.childcmp.updateDocFields('{date}',this.editItem.LETTER_BOOK_DATE);
            this.childcmp.updateDocFields('{attachment}',this.editItem.count_Attach>0?'دارد':'ندارد');
          });   

        this.docReadOnly=true;  
        if (this.editItem.LETTER_IS_SENT)
          this.docReadOnly=true;
        if (this.editItem.LETTER_IS_SENT && this.editItem.LETTER_AM_I_OWNER && this.editItem.LETTER_AM_I_ERJA)
          this.docReadOnly=false;
        if (!this.editItem.LETTER_IS_SENT && this.editItem.LETTER_AM_I_OWNER)
          this.docReadOnly=false;

        this.menuItems[1].visible=(!this.editItem.LETTER_IS_SENT) || ( this.editItem.LETTER_IS_SENT && this.editItem.LETTER_AM_I_ERJA )
        this.menuItems[0].visible=(!this.editItem.LETTER_IS_SENT) || ( this.editItem.LETTER_IS_SENT && this.editItem.LETTER_AM_I_ERJA ); 
        
        if(this.editItem.LETTER_IS_ARCHIVE){
          this.menuItems[4].text='بازگشت از آرشیو';          
        }
        else { this.menuItems[4].text='انتقال به آرشیو';  }
        
      }
      
    });


   };


  filter: any = {};
  editItem: any = {};
  Attachments:any={};
  Notes:any={};
  Categorys:any={};
  dataToPostBody: DataToPost;


  onMenuItemClick(name) {
    if (name == "archive"){
      this.dataToPostBody = {
        'Data': {
          'SPName': '[OFA].[OFA_Sp_letter]',
          'Data_Input': { 'Mode': 5,          
           'Header': {'LETTER_ID':this.editItem.LETTER_ID,
                      'LETTER_ARGHAVAN_TIME_STAMP':this.editItem.LETTER_ARGHAVAN_TIME_STAMP
                      }
          , 'Detail': '', 'InputParams': '' }
        }
        
      }
  
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {     
        if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
          this.editItem=data.ReturnData.Data_Output[0].Header[0];            
          this.loadLetter();
          Notify.success('اطلاعات با موفقیت ذخیره شد');


        }
        
      });
    
    }
    if (name == "cancel") {
      if (this.GRID_SOURCE=='out')
        this.router.navigate(["ofa/outLetters"]);
      else 
        this.router.navigate(["ofa/inLetters"]);
    }
    if (name == "save") {        
          this.Save(false  ,this.editItem.LETTER_ID?2:1).then((data) => { 
            if(data==true)
              { 
                Notify.success('اطلاعات با موفقیت ذخیره شد');
                this.new();  
              }
          });      
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
        if(!this.reciversDataSource || this.reciversDataSource.length<=0)
          {
            Notify.error('!سازمان گیرنده و کاربر گیرنده را انتخاب کنید');
            return; 
          }

      Dialog.confirm('تایید ارجاع', 'آیا مایل به ثبت تغییرات و ارسال نامه هستید؟').okay(() => {
        this.Save(true,this.editItem.LETTER_ID?2:1).then((data) => { 
            if(data==true)
              { 
                Notify.success('اطلاعات با موفقیت ذخیره شد');
                this.new();    
              }
          });    
        });    
      
    }
    if (name == "cancelSent" )
    {
      this.dataToPostBody = {
        'Data': {
          'SPName': '[OFA].[OFA_Sp_LETTER_CANCEL_SENT]',
          'Data_Input': { 'Mode': 0,          
           'Header': this.editItem
          , 'Detail': '', 'InputParams': '' }
        }
        
      }
  
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {     
        if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
          Notify.success('عملیات با موفقیت انجام شد ');  
          this.loadLetter();
        }
        
      })     
    }
  }

  Save(isSent: Boolean,mode :number): Promise<any> {
    // if (!this.editItem.LETTER_MAIN_FILE_ID)
    // {
    //   Notify.error('!تصویر نامه را بارگزاری کنید');
    //   return;
    // }
    return new Promise((resolve, reject) => {
          var result = this.form.instance.validate();
          if (result.isValid) 
          {    
          this.childcmp.saveDocument('ofa',this.editItem.LETTER_MAIN_FILE_ID).then((data) => {

          if (data==Guid.empty) 
          {
              Notify.error('خطا در بارگزاری متن نامه');
              return;
          }
          this.editItem.LETTER_MAIN_FILE_ID = data.fileid;
          if (this.categoryselected.length>0)
          { 
            this.Categorys=[];
            this.Categorys=this.categoryDataSource.filter(el => this.categoryselected.includes(el.CATEGORY_CAPTION));
          }


            
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
                'LETTER_SENDER_ID':this.editItem.LETTER_SENDER_ID,
                'LETTER_RECIVER_CMPN_ID': this.editItem.LETTER_RECIVER_CMPN_ID,
                'LETTER_RECIVER_USER_ID': this.editItem.LETTER_RECIVER_USER_ID,
                'LETTER_MAIN_FILE_ID':this.editItem.LETTER_MAIN_FILE_ID,
                'LETTER_ARGHAVAN_TIME_STAMP':this.editItem.LETTER_ARGHAVAN_TIME_STAMP,
                'LETTER_DESC':this.editItem.LETTER_DESC,
                'LETTER_IN_OUT_TYPE':this.editItem.LETTER_IN_OUT_TYPE,
                'LETTER_IS_SENT':  this.editItem.LETTER_IS_SENT,
                'LOAD_MAIN_FILE':true}
                , 'Detail': {'Attachments':this.Attachments,'Notes':this.Notes,'Category':this.Categorys,'Recivers':this.reciversDataSource}, 'InputParams': '' }
              }
            };
            
            this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
            then((data) => {
              
              resolve (true) ;
              
            });          
        }); 
      
          }
  });
  }

  valueChange_DatePicker(e, cell) {
    console.log('valueChange_DatePicker', e)
    console.log('editItem', this.editItem)
    
}

// onCompanyChange(e) {
//   console.log('FilterCompanyCondition',e);
//   this.FilterCompanyCondition = {
//     SUSR_CMPN_ID: e.ID
//   };
// }

onTemplateChange(e) {
  console.log('Template',e);
  this.childcmp.openDocument(e.FILE_PATH,!this.editItem.FILE_NAME?'unknow.docx':this.editItem.FILE_NAME);
}


onAttachClick(e) {
  this.core.fileExplorer.open({entity:this.editItem, entityId: this.editItem.ID,tabelName:"OFA_LETTER"
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
        entityId:'kkkk',// this.editItem.LETTER_ID,
        folderid: this.editItem.FolderID,        
        ...this.config
    } //TODO add entity id from explorer
}).then(res => {
  console.log(res);
  this.editItem.LETTER_MAIN_FILE_ID = res.Result[0].ID;
  this.editItem.MainFilePatch=environment.url+res.Result[0].Patch;
  this.editItem.FILE_BASE64STRING=res.Result[0].FILE_BASE64STRING;
  this.editItem.FLTP_ICON=res.Result[0].Icon;
  this.editItem.FLTP_DES=res.Result[0].FileType;
  this.editItem.FILE_TITLE=res.Result[0].Title;
  // this.wvinstance.loadDocument(this.editItem.MainFilePatch,{    
  // })
})
}

showNote(e) {
  
  this.popup.open(LetterNoteListComponent, {
    title: 'یادداشتها',
    width:"60%",
    height:"70%",
    data: {
        entity:this.editItem,
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
