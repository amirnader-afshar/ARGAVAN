import { AfterViewInit, Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { BasePage } from '../../shared/BasePage';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { TemplateHandler } from 'easy-template-x';

import { Notify } from '../../shared/util/Dialog';

import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { PermissionService } from '../../shared/permission';
import { CoreService } from "../../shared/services/CoreService";

import { FileExplorerInputConfig } from "../../shared/components/fileExplorer/fileexplorer.util";
import { DemisPopupService } from "../../shared/components/popup/demis-popup-service";

import { JalaliPipe } from '../../shared/pipes/jalali_show_date_full_name';

import { Guid } from 'src/app/shared/types/GUID';
import { environment } from '../../../environments/environment';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { FileGroup,fileExtensionConvertor } from "../../shared/components/fileExplorer/fileexplorer.util";
import { RouteData } from '../../shared/util/RouteData';
import { ConfigService } from 'src/app/shared/services/ConfigService';
import { LetterNoteListComponent } from '../letter-note-list/letter-note-list.component';
import { LettrtErjaatComponent } from "../lettrt-erjaat/lettrt-erjaat.component";
import { Dialog } from '../../shared/util/Dialog';
import   { WebViewerInstance }  from '@pdftron/webviewer';

import { FileDto } from 'src/app/shared/components/fileExplorer/Dtos/fileDto';
import { FileExplorerService } from 'src/app/shared/components/fileExplorer/fileexplorer.service.proxy';
import {  ViewportScroller } from '@angular/common';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from 'src/app/shared/Deferred';
import DataSource from 'devextreme/data/data_source';




@Component({
  selector: 'app-root-outLetter',
  templateUrl: './outLetter.component.html',
  styleUrls: ['./outLetter.component.scss'],
})
export class outLettercomponent extends BasePage implements OnInit,AfterViewInit {

  
  AttachmentsFiles: FileDto = new FileDto();
  MainFile: FileDto = new FileDto();

  filepath:string=environment.url;
  
  config: FileExplorerInputConfig = new FileExplorerInputConfig();
  docReadOnly : Boolean;  
  FilterCompanyCondition: any = { SUSR_CMPN_ID: null };
  menuItems = [];
  ALLOW_PRG_UFIF_001;
  OFA_AUTO_BOOK_NO;
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  @ViewChild('viewer',{static: false}) vieweRef: ElementRef;
  @ViewChild(DxDataGridComponent, { static: false }) companygrid: DxDataGridComponent;
  
  GRID_SOURCE;
  user;
  allcategoryItems: any[];
  categoryselected: string[]=[];
  categoryDataSource: any = {};
  CompanydataSource:any ={};
  reciversDataSource:any =[];
  fileUrl;
  allow_OFA_ACT_001;

  constructor(private explorerService: FileExplorerService,public translate: TranslateService
            , public router: Router,private readonly viewport: ViewportScroller,
            private route: ActivatedRoute
            , public service: ServiceCaller
            ,public permissionService: PermissionService,
            public core: CoreService,
            public popup: DemisPopupService,
            private routeData: RouteData, private confService: ConfigService,
            private datepipe :JalaliPipe
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
        this.loadNoteGrid();
      }

      this.loadCategory();
              
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

OnMainFileChange(e){
  this.MainFile.files= e.target.files;
  this.Mainfileupload();

}

Mainfileupload(): void {   
       
  this.MainFile.fileGroup = FileGroup.ofaMainFile.toString();
  this.MainFile.entityId = this.editItem.ID;
  this.MainFile.tabelName = "OFA_LETTER";
  this.MainFile.SaveAsPDF = true;
  this.explorerService.uploadFile(this.MainFile).then(res => {
      if (res!=null){
        console.log('res MainFile',res);
        var id,docxbase64 ;
        
        res.Result.forEach(function (arrayItem) { 
          if (arrayItem.FileType==="WORD")
          {
            id=  arrayItem.ID;
            docxbase64=arrayItem.FILE_BASE64STRING;
          }
        
        });  
        this.editItem.LETTER_MAIN_FILE_ID =id;   
        this.DOCXbase64String=docxbase64;   


        var base64 ;
        res.Result.forEach(function (arrayItem) { 
          if (arrayItem.FileType==="PDF")
          {
            base64 = arrayItem.FILE_BASE64STRING
          }          
        });
        this.PDFbase64String=base64;
      }
          
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
  
  this.service.getfile("/EDM/File/Download?fileId=" + id, (data) => {

  });
}

upload(): void {        
      this.AttachmentsFiles.fileGroup = FileGroup.ofaAttachments.toString();
      this.AttachmentsFiles.entityId = this.editItem.ID;
      this.AttachmentsFiles.tabelName = "OFA_LETTER";
      this.explorerService.uploadFile(this.AttachmentsFiles).then(res => {
          if (res!=null){
            console.log('res',res);
            console.log('attach',this.Attachments);
            this.Attachments=[...this.Attachments?.length?this.Attachments:[] ,...res.Result];
          }
              
      });  
}

   dblClick(e)
   {
      if (!e.data.IS_IT_CMPN_TEXT)
        {return;}

      let found:any;
      if (e.data.IS_IT_CMPN)
      {
        found = this.reciversDataSource.some(el => el.SUSR_ID === e.data.SUSR_ID);
      }
      else
        found = this.reciversDataSource.some(el => el.CMPN_ID === e.data.CMPN_ID);

      if (!found) {
        this.reciversDataSource.push(e.data); 
        let index;
          if (e.data.IS_IT_CMPN)
          {          
            index = this.CompanydataSource.findIndex(d => d.SUSR_ID === e.data.SUSR_ID); //find index in your array
          }
          else
            index = this.CompanydataSource.findIndex(d => d.CMPN_ID === e.data.CMPN_ID); //find index in your array        
          
          this.CompanydataSource.splice(index, 1);//remove element from array
          this.checkParent(e.data.IS_IT_CMPN_TEXT);
      }
   }


   onPRIORITYChange(e) {
    this.editItem.PUB_PRIORITY_ICON=e.PRIORITY_ICON
    
  }
   onAddAllClick(e){
    this.viewport.scrollToAnchor('test');
   let selectedData : any = [];
    this.CompanydataSource.forEach(function (arrayItem) { 
      if (arrayItem.checked)
      {
        selectedData.push(arrayItem); 
      }

    });
    
    const that = this;
    let data : any=[];
    let found:any;
    selectedData.forEach(function (arrayItem) {   
      if (arrayItem.IS_IT_CMPN)
      {
        found = that.reciversDataSource.some(el => el.SUSR_ID === arrayItem.SUSR_ID);
      }
      else
        found = that.reciversDataSource.some(el => el.CMPN_ID === arrayItem.CMPN_ID);

      if (!found) { 
        data.push(arrayItem); 
        let index;
        if (arrayItem.IS_IT_CMPN)
        {          
           index = that.CompanydataSource.findIndex(d => d.SUSR_ID === arrayItem.SUSR_ID); //find index in your array
        }
        else
           index = that.CompanydataSource.findIndex(d => d.CMPN_ID === arrayItem.CMPN_ID); //find index in your array        

        that.CompanydataSource.splice(index, 1);//remove element from array
        that.companygrid.instance.byKey([arrayItem.IS_IT_CMPN_TEXT]).then(group => {
          if (arrayItem.IS_IT_CMPN)
          { 
            if (group.items)         
              index = group.items.findIndex(d => d.SUSR_ID === arrayItem.SUSR_ID); //find index in your array
            else
              index = group.collapsedItems.findIndex(d => d.SUSR_ID === arrayItem.SUSR_ID); //find index in your array

          }
          else
          {
            if (group.items)  
              index = group.items.findIndex(d => d.CMPN_ID === arrayItem.CMPN_ID);  
            else
              index = group.collapsedItems.findIndex(d => d.CMPN_ID === arrayItem.CMPN_ID);  

          }
          if (group.items) 
            group.items.splice(index,1);
          else 
            group.collapsedItems.splice(index,1);
            
        });
        that.checkParent(arrayItem.IS_IT_CMPN_TEXT);

      }
  });
  this.reciversDataSource=[...this.reciversDataSource,...data];
  }
  groupCheckboxModel: any = {};
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
            this.CompanydataSource.forEach(c => {
              c.checked = false
              this.groupCheckboxModel[c.IS_IT_CMPN_TEXT] = false;
          }); 
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
      var suffix = this.confService.get('OFA-BOOK-SUFFIX');
      var PREFIX1 = this.confService.get('OFA-BOOK-PREFIX1');
      var PREFIX2 = this.confService.get('OFA-BOOK-PREFIX2');
      var FREENO = this.confService.get('OFA-LAST-FREE-NO');

      var PREFIX = PREFIX1.trim()+(PREFIX2.trim() !='' ? '/' : '' )+ PREFIX2.trim();  

      var BN = PREFIX + '/'+FREENO;
      suffix = (suffix.trim() !='' ? '/' : '' )+ suffix.trim();  
      this.editItem.LETTER_BOOK_NUMBER = BN+suffix;
    
           })                            
      }
  }

  new(){    
    this.editItem={LETTER_IN_OUT_TYPE:this.editItem.LETTER_IN_OUT_TYPE
                  ,FolderID:Guid.empty,LETTER_BOOK_DATE:this.editItem.LETTER_BOOK_DATE
                  ,LETTER_DATE:this.editItem.LETTER_DATE}
    this.reciversDataSource=[];  
    this.Attachments=[];
    this.getBookNumber();  
    this.loadCompanys();        
    this.DOCXbase64String="";
    this.PDFbase64String="";
  }

  ngOnInit() {

     this.allow_OFA_ACT_001 = this.permissionService.hasDefined('OFA-ACT-001');//چک دسترسی به امضای نامه 
    
    this.editItem.LETTER_IN_OUT_TYPE = this.route.snapshot.data["LETTER_IN_OUT_TYPE"];
    this.editItem.FolderID = Guid.empty;    
    this.getBookNumber();
    this.loadCompanys();
    this.LoadStaredNotes();
   
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
        this.Attachments=this.editItem.ATTACHMENTS; 
        this.MainFiles=this.editItem.MAINFILES;
        // this.reciversDataSource =  [ ...this.editItem.LETTER_CMPNY_RECIVERS_DATA? this.editItem.LETTER_CMPNY_RECIVERS_DATA:[]
        //     , ...this.editItem.LETTER_NONE_CMPNY_RECIVERS_DATA?this.editItem.LETTER_NONE_CMPNY_RECIVERS_DATA:[]];  
        if (this.MainFiles){
            var pdfbase64,docxbase64 ;

            this.MainFiles.forEach(function (arrayItem) { 
              if (arrayItem.FileType==="PDF")
              {
                pdfbase64 = arrayItem.FILE_BASE64STRING
              }

              if (arrayItem.FileType==="WORD")
              {
                docxbase64 = arrayItem.FILE_BASE64STRING
              }
              
            });
            this.PDFbase64String=pdfbase64;
            this.DOCXbase64String=docxbase64;


        }

        this.docReadOnly=true;  

        if (this.editItem.LETTER_ONE_WAY_ERJA)
          {
            this.docReadOnly=true;
            this.menuItems[1].visible=false;
            this.menuItems[0].visible=false;
          }
        else
          {
            this.docReadOnly=false;
            if(!this.editItem.LETTER_AM_I_ERJA)
              this.docReadOnly=true;

            this.menuItems[1].visible=(!this.editItem.LETTER_IS_SENT) || ( this.editItem.LETTER_IS_SENT && this.editItem.LETTER_AM_I_ERJA )
            this.menuItems[0].visible=(!this.editItem.LETTER_IS_SENT) || ( this.editItem.LETTER_IS_SENT && this.editItem.LETTER_AM_I_ERJA ); 
          }
        
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
  MainFiles:any={};
  Notes:any={};
  Categorys:any={};
  dataToPostBody: DataToPost;
  PDFbase64String:any;
  DOCXbase64String:any;




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

    return new Promise((resolve, reject) => {
      // if (!this.editItem.LETTER_MAIN_FILE_ID)
      // {
      //   Notify.error('!تصویر نامه را بارگزاری کنید');
      //   reject('!تصویر نامه را بارگزاری کنید');
      //   return;
      // }

          var result = this.form.instance.validate();
          if (result.isValid) 
          {    

  
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
                'LOAD_MAIN_FILE':true,
                'LETTER_PUB_PRIORITY_ID':this.editItem.LETTER_PUB_PRIORITY_ID}
                , 'Detail': {'Attachments':this.Attachments,'Notes':this.Notes,'Category':this.Categorys,'Recivers':this.reciversDataSource}, 'InputParams': '' }
              }
            };
            
            this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
            then((data) => {
              
              resolve (true) ;
              
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
}


onAttachClick(e) {
  this.core.fileExplorer.open({entity:this.editItem, entityId: this.editItem.ID,tabelName:"OFA_LETTER"
        , fileGroup: FileGroup.ofaAttachments,multipleModeDisable:true,enableSecurityMode:false}).then((data) => {
    this.Attachments=data;
    this.editItem.count_Attach=data.length;

  });    

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
getBlobFromUrl(url)
{
  return new Promise<File>((resolve, reject) => {

    var json = atob(this.DOCXbase64String);
        var ia = new Uint8Array(json.length);
        for (var i = 0; i < json.length; i++) {
          ia[i] = json.charCodeAt(i);
        }
        var blob = new Blob([ia], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
        resolve(blob as File);
        //var url = window.URL.createObjectURL(blob);
        //window.open(url); 

  // this.service.get("/EDM/File/GetFileBase64?entityId=72760809-985f-ee11-9c93-f816541c96c9", (data) => {
  //   console.log("getfile",data);
  //     var json = atob(data.FILE_BASE64STRING);
  //     var ia = new Uint8Array(json.length);
  //     for (var i = 0; i < json.length; i++) {
  //       ia[i] = json.charCodeAt(i);
  //     }
  //     var blob = new Blob([ia], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  //     resolve(blob as File);
  //     var url = window.URL.createObjectURL(blob);
  //     window.open(url); 
         
  //     });
  });
};

getSignBlobFromUrl()
{
  return new Promise<Blob>((resolve, reject) => {
    var json = atob(localStorage.getItem('Sign_FILE_BASE64STRING'));
    var ia = new Uint8Array(json.length);
    for (var i = 0; i < json.length; i++) {
      ia[i] = json.charCodeAt(i);
    }
    var imgblob = new Blob([ia], { type: 'image/png'});
    resolve(imgblob);
  });
};

async  genReport(e) {

  const templateFile = await this.getBlobFromUrl("");
  const imgblob = await this.getSignBlobFromUrl();
  this.editItem.sh = this.datepipe.transform(this.editItem.LETTER_BOOK_DATE);
  // 2. process the template
  var swith= +this.confService.get('OFA-USER-SIGN-WIDTH');
  var shight =+this.confService.get('OFA-USER-SIGN-HIGHT');
  const data = {
      "محل امضاء": {
        _type: "image",
        source: imgblob,
        format: 'image/png',
        altText: "sign", // Optional
        width: swith,
        height: shight
    }
  ,"شماره":this.editItem.LETTER_BOOK_NUMBER_REVERSE,
  "تاریخ":this.editItem.sh,
  "پیوست": this.Attachments? this.Attachments.length>0?'دارد':'ندارد':'ندارد'
  };
  

  const handler = new TemplateHandler();
  const doc = await handler.process(templateFile, data);
  this.saveFile(this.editItem.ID+' - signed.docx', doc);
}
 saveFile(filename, blob) {
  var file = new File([blob], filename, {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', lastModified: Date.now()});
  let list = new DataTransfer();
  list.items.add(file);
  this.MainFile.files=list.files;
  this.Mainfileupload();

  // // see: https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link

  // // get downloadable url from the blob
  // const blobUrl = URL.createObjectURL(blob);

  // // create temp link element
  // let link = document.createElement("a");
  // link.download = filename;
  // link.href = blobUrl;

  // // use the link to invoke a download
  // document.body.appendChild(link);
  // link.click();

  // // remove the link
  // setTimeout(() => {
  //     link.remove();
  //     window.URL.revokeObjectURL(blobUrl);
  //     link = null;
  // }, 0);
}

showGrafErjaat(){
  this.routeData.push('ofa_outLetter',this.editItem);
  this.router.navigate(["ofa/letterErjaatGraph"],{ 
                              queryParams: {letterType:this.GRID_SOURCE
                                                  }
}); 
}

onreciversDataSourceSelectedDelete(e)
{
  const that = this;
  
  e.data.forEach(function (arrayItem) {
    let found:any;
    if (arrayItem.IS_IT_CMPN)
    {
      found = that.CompanydataSource.some(el => el.SUSR_ID === arrayItem.SUSR_ID);
    }
    else
      found = that.CompanydataSource.some(el => el.CMPN_ID === arrayItem.CMPN_ID);      
    if (!found) {
      arrayItem.checked = false;
      that.CompanydataSource.push(arrayItem); 
      that.checkParent(arrayItem.IS_IT_CMPN_TEXT);
    }
  });
}

onreciversDataSourceRowRemoving(e)
{
  let found:any;
  if (e.data.IS_IT_CMPN)
  {
    found = this.CompanydataSource.some(el => el.SUSR_ID === e.data.SUSR_ID);
  }
  else
    found = this.CompanydataSource.some(el => el.CMPN_ID === e.data.CMPN_ID);    
    
    if (!found) {
      e.data.checked=false;
      this.CompanydataSource.push(e.data); 
      this.checkParent(e.data.IS_IT_CMPN_TEXT);
    }
}

onParentChecked(e, d) {
  
  if (e.event) {
    if(d.data.collapsedItems)
      d.data.collapsedItems.forEach(element => {
          element.checked = e.value;
      });
    else
    {
      d.data.items.forEach(element => {
        element.checked = e.value;
    });      
    }
  }
}
onChildChecked(e, d) {
  
  if (e.event) {
      d.data.checked = e.value;
      this.checkParent(d.data.IS_IT_CMPN_TEXT)
  }
}
checkParent(IS_IT_CMPN_TEXT) {
  this.companygrid.instance.byKey([IS_IT_CMPN_TEXT]).then(group => {
      let data ;
      if (group.items){
          data = group.items
      }
      else
      { data =group.collapsedItems }

      const everyChecked = data.every(e => e.checked);
      const someChecked = data.some(e => e.checked);
      if (everyChecked) {
          this.groupCheckboxModel[IS_IT_CMPN_TEXT] = true;
      } else if (someChecked) {
          this.groupCheckboxModel[IS_IT_CMPN_TEXT] = undefined;
      } else {
          this.groupCheckboxModel[IS_IT_CMPN_TEXT] = false;
      }
  })
}

NoteDataSource: any = {};
StaredDataSource: any = {};
LETTER_NOTE_SELECTED ;
Note_add_checkBoxValue: boolean =false;

loadNoteGrid(){
  this.dataToPostBody = {
    'Data': {
      'SPName': '[OFA].[OFA_Sp_LETTER_NOTE]',
      'Data_Input': { 'Mode': 4,          
       'Header': {'LETTER_NOTE_LETTER_ID':this.editItem.LETTER_ID
                   }
      , 'Detail': '', 'InputParams': '' }
    }
    
  }

  this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
  then((data) => {   
    if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {  
      this.NoteDataSource=data.ReturnData.Data_Output[0].Header;  
      this.NoteDataSource.store = new CustomStore({
        key: "LETTER_NOTE_ID",
        load: (loadOptions) => {
          let deferred: Deferred<any> = new Deferred<any>();
          console.log("dataSource", this.NoteDataSource);
          deferred.resolve(this.NoteDataSource);
          return deferred.promise;        
      },
      });
     }     
  });


 };


 LoadStaredNotes ()
 {
   this.dataToPostBody = {
     'Data': {
       'SPName': '[OFA].[OFA_SP_GET_USER_STARED_NOTES]',
       'Data_Input': { 'Mode': 4,          
        'Header': ''
       , 'Detail': '', 'InputParams': '' }
     }      
   }    
   this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
   then((data) => {     

      let empty = [];
       this.StaredDataSource = new DataSource({
        store: {
          data: data.ReturnData.Data_Output[0].Header.Header !='is Empty' ? data.ReturnData.Data_Output[0].Header:empty,
          type: 'array',
          key: 'ID',
        },
      });             
     
     
   });

 }
 addCustomItem(data) {
  if (!data.text) {
    data.customItem = null;
    return;
  }

  let u = Date.now().toString(16)+Math.random().toString(16)+'0'.repeat(16);
  let guid = [u.substr(0,8), u.substr(8,4), '4000-8' + u.substr(13,3), u.substr(16,12)].join('-');
  const newItem = {
    LETTER_NOTE_CONTENT: data.text,
    ID: guid,
  };

  data.customItem = this.StaredDataSource.store().insert(newItem)
    .then(() => this.StaredDataSource.load())
    .then(() => newItem)
    .catch((error) => {
      throw error;
    });
}

onNoteAdd(item)
{
  item.LETTER_NOTE_LETTER_ID=this.editItem.LETTER_ID;
  item.LETTER_NOTE_STARED=this.Note_add_checkBoxValue;
  item.LETTER_NOTE_IS_PUBLIC=true;
  this.dataToPostBody = {
    'Data': {
      'SPName': '[OFA].[OFA_Sp_LETTER_NOTE]',
      'Data_Input': { 'Mode': 1,          
       'Header': item 
      , 'Detail': {}, 'InputParams': '' }
    }
  };
    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {                        

        Notify.success('اطلاعات با موفقیت ذخیره شد');
        this.loadNoteGrid();
      });
}

onNoteDelete(item)
{
  this.dataToPostBody = {
    'Data': {
      'SPName': '[OFA].[OFA_Sp_LETTER_NOTE]',
      'Data_Input': { 'Mode': 3,          
       'Header': item 
      , 'Detail': {}, 'InputParams': '' }
    }
  };
    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {                        

        Notify.success('اطلاعات با موفقیت حذف شد');
        this.loadNoteGrid();
      });
}

}
