import { Component, OnInit ,Input} from '@angular/core';

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
  en = environment;
  dataToPostBody: DataToPost;
  constructor(public service: ServiceCaller) { }

  ngOnInit(): void {
  
  }
  courseSignup(courseID){
    this.dataToPostBody = {
      'Data': {
        'SPName': '[EDU].[EDU_Sp_USER_COURSE]',
        'Data_Input': { 'Mode': 1,          
         'Header': {'USER_COURSE_EDU_COURSE_ID': courseID,'USER_COURSE_IS_PAYED':false}
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
          Notify.success('ثبت نام انجام شد');            
        });     
   }

}
