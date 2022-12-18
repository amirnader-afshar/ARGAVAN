import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { SmsService } from 'src/app/shared/services/SmsService';
import { TranslateService } from 'src/app/shared/services/TranslateService';

import { environment } from '../../../../environments/environment';
import { DataToPost } from "../../../shared/services/data-to-post.interface";
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { Notify } from '../../../shared/util/Dialog';
@Component({
  selector: 'edu-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  @Input() item: any = {};
  @Input() userInfo: any = {};
  @Output() userReged : EventEmitter<any>= new EventEmitter<any>();
  en = environment;
  dataToPostBody: DataToPost;

  constructor(public service: ServiceCaller
              ,private smsservise:SmsService,
              private translate: TranslateService,private router: Router,) { }

  ngOnInit(): void {
  
  }
  courseSignup(courseID,COURSE_IS_PAYED,COURSE_REGED,USER_COURSE_ID){

    if(this.item.COURSE_REMAIN_CAPICITY<=0){
      Notify.error('ظرفیت تکمیل امکان ثبت نام وجود ندارد!');  
      return;     

    }
    if(COURSE_REGED && !COURSE_IS_PAYED)
    {
      if (this.item.COURSE_COST!=0){
      this.redirectToBank(USER_COURSE_ID)
      }
    }
    else {
            this.dataToPostBody = {
              'Data': {
                'SPName': '[EDU].[EDU_Sp_USER_COURSE]',
                'Data_Input': { 'Mode': 1,          
                'Header': {'USER_COURSE_EDU_COURSE_ID': courseID,'USER_COURSE_IS_PAYED': this.item.COURSE_COST==0?true:false}
                , 'Detail': '', 'InputParams': '' }
              }
              
            }

            this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
            then((data) => {     
                  Notify.success('ثبت نام انجام شد');       
                  
                  
                  if (this.item.COURSE_COST!=0){
                    this.redirectToBank( data.ReturnData.Data_Output[0].Header[0].USER_COURSE_ID);
                  }
                  else{
                    this.userReged.emit(courseID);
                  }
                  // this.smsservise.sendSms([this.userInfo.]
                  //                     ,["ثبت نام شما در دوره آموزشی با موفقیت انجام شد "+"\n"+this.translate.instant('ADM_CMPN_NAM_REAL_NAME')])
                });  
      }   
   }

   

   redirectToBank(USER_COURSE_ID){
    var _beforPayData = {
            
      'SPName': '[EDU].[EDU_Sp_USER_COURSE]',
      'SchemaObject':{
          'Schema':'EDU','Object':'EDU_USER_COURSE'
      },
      'Data_Input': { 'Mode': 4,          
       'Header': {'USER_COURSE_ID':USER_COURSE_ID,'USER_COURSE_IS_PAYED':false}
      , 'Detail': '', 'InputParams': '' }
    
    
  }   
        
  window.location.href =environment.url+'ADM_BANKPAY?beforPayData='+( JSON.stringify(_beforPayData))

   }


   downloadFile(id) {
    debugger
    this.service.getfile("/EDM/File/Download?fileId=" + id, (data) => {

    });
}

}
