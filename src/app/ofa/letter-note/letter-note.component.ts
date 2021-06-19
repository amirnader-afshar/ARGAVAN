import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { PopupBasePage } from '../../shared/BasePage';
import { ServiceCaller } from '../../shared/services/ServiceCaller';

@Component({
  selector: 'app-letter-note',
  templateUrl: './letter-note.component.html',
  styleUrls: ['./letter-note.component.scss']
})
export class LetterNoteComponent extends PopupBasePage implements OnInit {

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

  constructor(public translate: TranslateService, public service: ServiceCaller) { 
    super(translate); 
  }

  ngOnInit(): void {
    this.editItem=this.popupInstance.data.editItem;
    this.editItem.LETTER_NOTE_LETTER_ID=this.popupInstance.data.entityId;
    this.editItem.LETTER_NOTE_TABEL_ROW=this.popupInstance.data.entityId;
    this.editItem.LETTER_NOTE_TABEL_NAME=this.popupInstance.data.tabelName;
  }
  valueChange(value) {
    this.editItem.LETTER_NOTE_CONTENT = value;
}
  onMenuItemClick(name) {

    if (name == "cancel") {

      
    }
    if (name == "save") {
      if (!this.editItem.LETTER_NOTE_CONTENT){
        Notify.error('متن یادداشت نمی تواند خالی باشد!');
        return;
      }
      var mode = 1;
      if (this.editItem.LETTER_NOTE_ID)
        {
          mode=2;
        }
      var result = this.form.instance.validate();
      if (result.isValid) {
        console.log("this.editItem", this.editItem);
        this.dataToPostBody = {
        'Data': {
          'SPName': '[OFA].[OFA_Sp_LETTER_NOTE]',
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
