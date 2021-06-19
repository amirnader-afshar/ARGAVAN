import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { PopupBasePage } from '../../shared/BasePage';
import { ServiceCaller } from '../../shared/services/ServiceCaller';

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
      name: "cancel",
      text: 'انصراف',
      icon: "fa fa-ban red",
      visible: true
    },
  ];
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  editItem: any = {};
  dataToPostBody: DataToPost;
  FilterCompanyCondition: any = { SUSR_CMPN_ID: null };

  constructor(public translate: TranslateService, public service: ServiceCaller) { 
    super(translate); 
  }

  ngOnInit(): void {

  }

  onCompanyChange(e) {
    console.log('FilterCompanyCondition',e);
    this.FilterCompanyCondition = {
      SUSR_CMPN_ID: e.ID
    };
  }

  valueChange(value) {
    this.editItem.MSG_BODY = value;
}
  onMenuItemClick(name) {

    if (name == "cancel") {

      
    }
    if (name == "save") {
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
          , 'Detail': {}, 'InputParams': '' }
        }
      };
        this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
          then((data) => {                        
            console.log("return data", this.editItem);
            Notify.success('اطلاعات با موفقیت ذخیره شد');
            this.popupInstance.result(data);
            this.popupInstance.close();
          });
      }

    }
  }

}

