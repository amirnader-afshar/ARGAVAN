import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ServiceCaller } from '../../shared/services/ServiceCaller';

import { DataToPost } from "../../shared/services/data-to-post.interface";
import { Notify } from '../../shared/util/Dialog';

@Component({
  selector: 'app-edu-person-info',
  templateUrl: './edu-person-info.component.html',
  styleUrls: ['./edu-person-info.component.scss']
})
export class EduPersonInfoComponent implements OnInit {

  constructor(public router: Router,public service: ServiceCaller) { }
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  editItem :any ={};
  dataToPostBody: DataToPost;
  genders = [
    'مرد',
    'زن',
  ];
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
    this.loadData();
  }
  loadData(){

    this.dataToPostBody = {
      'Data': {
        'SPName': '[EDU].[EDU_Sp_PERSONINFO]',
        'Data_Input': { 'Mode': 5,          
         'Header': ''
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.editItem=data.ReturnData.Data_Output[0].Header[0];        
      }            
        });
   };
  onMenuItemClick(name) {

    if (name == "cancel") {

      this.router.navigate(["edu/home"]);
    }
    if (name == "save") {
      var result = this.form.instance.validate();
      if (result.isValid) {
        console.log("this.editItem", this.editItem);
        debugger
        var mode = 1;
        if (this.editItem.PERSONINFO_ID)
          {
            mode=2;
          }
          this.dataToPostBody = {
            'Data': {
              'SPName': 'EDU.EDU_Sp_PERSONINFO',
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


