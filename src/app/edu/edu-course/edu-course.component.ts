import { Component, OnInit,ViewChild } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ServiceCaller } from '../../shared/services/ServiceCaller';

import { DataToPost } from "../../shared/services/data-to-post.interface";
import { Notify } from '../../shared/util/Dialog';
import * as moment from 'jalali-moment';


@Component({
  selector: 'app-edu-course',
  templateUrl: './edu-course.component.html',
  styleUrls: ['./edu-course.component.scss']
})
export class EduCourseComponent implements OnInit {

  constructor(private route: ActivatedRoute,public router: Router,public service: ServiceCaller) {
    this.route.queryParams.subscribe(params => {

      this.editItem.COURSE_ID = params['COURSE_ID'];


  });
   }
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  editItem :any ={};
  dataToPostBody: DataToPost;
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

  ngOnInit(): void {
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

        this.editItem.COURSE_BEGINTIME = d;         
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
          this.editItem.COURSE_BEGINTIME = this.editItem.COURSE_BEGINTIME.toLocaleTimeString('en-GB')
          this.dataToPostBody = {
            'Data': {
              'SPName': 'EDU.EDU_Sp_COURSE',
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
              });
          }           

      }

    }
  }



