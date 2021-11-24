import { Component, OnInit,ViewChild } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ServiceCaller } from '../../shared/services/ServiceCaller';

import { DataToPost } from "../../shared/services/data-to-post.interface";
import { Notify } from '../../shared/util/Dialog';
import { FileExplorerInputConfig,FileGroup } from "../../shared/components/fileExplorer/fileexplorer.util";
import { DemisPopupService } from "../../shared/components/popup/demis-popup-service";
import { UploadPopupComponent } from "../../shared/components/fileExplorer/upload.popup";
import { environment } from '../../../environments/environment';
import { Guid } from 'src/app/shared/types/GUID';
import { CoreService } from "../../shared/services/CoreService";

@Component({
  selector: 'app-edu-course',
  templateUrl: './edu-course.component.html',
  styleUrls: ['./edu-course.component.scss']
})
export class EduCourseComponent implements OnInit {

  constructor(private route: ActivatedRoute,public router: Router,public service: ServiceCaller
    ,public popup: DemisPopupService,public core: CoreService) {
    this.route.queryParams.subscribe(params => {

      this.editItem.COURSE_ID = params['COURSE_ID'];


  });
   }
   config: FileExplorerInputConfig = new FileExplorerInputConfig();
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  editItem :any ={};
  COURSE_BEGINTIME;
  COURSE_EXAM_TIME;
  dataToPostBody: DataToPost;
  Attachments:any={};
  menuItems = [
    {
      name: "save",
      icon: "fa fa-floppy-o green",
      text: 'ذخیره',
      visible: true
    },
    {
      name: "cancel",
      text: 'انصراف',
      icon: "fa fa-ban red",
      visible: true
    },
  ];
  onAttachClick(e) {
    this.core.fileExplorer.open({ entityId: this.editItem.ID,tabelName:"EDU_COURSE"
          , fileGroup: FileGroup.eduCourseAttachments,multipleModeDisable:true,enableSecurityMode:false}).then((data) => {
      this.Attachments=data;
      this.editItem.count_Attach=data.length;
  
    });    
  
  }
  ngOnInit(): void {
    this.editItem.FolderID = Guid.empty;
    if (this.editItem.COURSE_ID){
      this.loadData();
    }
    
  }
  loadData(){

    this.dataToPostBody = {
      'Data': {
        'SPName': '[EDU].[EDU_Sp_COURSE]',
        'Data_Input': { 'Mode': 4,          
         'Header': this.editItem
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.editItem=data.ReturnData.Data_Output[0].Header[0];

        let d = new Date(); // Creates a Date Object using the clients current time
        let [hours, minutes, seconds] = this.editItem.COURSE_BEGINTIME.split(':'); // Using ES6 destructuring
        // var time = "18:19:02".split(':'); // "Old" ES5 version        
        d.setHours(+hours); // Set the hours, using implicit type coercion
        d.setMinutes(minutes); // You can pass Number or String. It doesn't really matter
        d.setSeconds(seconds);
        // If needed, adjust date and time zone
        this.COURSE_BEGINTIME = d;  

        let dd = new Date(); // Creates a Date Object using the clients current time
        [hours, minutes, seconds] = this.editItem.COURSE_EXAM_TIME.split(':');
        dd.setHours(+hours); 
        dd.setMinutes(minutes); 
        dd.setSeconds(seconds);
        this.COURSE_EXAM_TIME = dd;

        this.editItem.FILE_PATH=environment.url+this.editItem.FILE_PATH;
      }            
        });
   };
  onMenuItemClick(name) {

    if (name == "cancel") {

      this.router.navigate(["edu/edu-course-list"]);
    }
    if (name == "save") {
      var result = this.form.instance.validate();
      if (result.isValid) {
        console.log("this.editItem", this.editItem);
        debugger
        var mode = 1;
        if (this.editItem.COURSE_ID)
          {
            mode=2;
          }
          this.editItem.COURSE_BEGINTIME = this.COURSE_BEGINTIME.toLocaleTimeString('en-GB');
          this.editItem.COURSE_EXAM_TIME = this.COURSE_EXAM_TIME.toLocaleTimeString('en-GB');

          this.dataToPostBody = {
            'Data': {
              'SPName': 'EDU.EDU_Sp_COURSE',
              'Data_Input': { 'Mode': mode,          
               'Header': this.editItem  
              , 'Detail':  {'Attachments':this.Attachments}, 'InputParams': '' }
            }
          };
            this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
              then((data) => {                        
                console.log("return data", this.editItem);
                Notify.success('اطلاعات با موفقیت ذخیره شد');
                if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
                  this.editItem=data.ReturnData.Data_Output[0].Header[0];
                  
                }                  
              });
          }           

      }

    }
    uploadfile(e) {
      this.config.fileGroup=FileGroup.eduCourse_pic;
      this.config.multipleModeDisable=true;
      this.config.enableSecurityMode=false;
      this.popup.open(UploadPopupComponent, {
        title: 'بارگذاری فایل',
        data: {
            entityId: this.editItem.COURSE_ID,
            folderid: this.editItem.FolderID,        
            ...this.config
        } //TODO add entity id from explorer
    }).then(res => {
      console.log(res);
      this.editItem.COURSE_IMG_ID = res.Result[0].ID;
      this.editItem.FILE_PATH=environment.url+res.Result[0].Patch;
      this.editItem.FILE_BASE64STRING=res.Result[0].FILE_BASE64STRING;
      this.editItem.FLTP_ICON=res.Result[0].Icon;
      this.editItem.FLTP_DES=res.Result[0].FileType;
      this.editItem.FILE_TITLE=res.Result[0].Title;
      // this.wvinstance.loadDocument(this.editItem.MainFilePatch,{    
      // })
    })
    }
  }



