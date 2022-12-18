import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { DataToPost } from 'src/app/shared/services/data-to-post.interface';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';
import { Guid } from 'src/app/shared/types/GUID';
import { Notify } from 'src/app/shared/util/Dialog';
import { RouteData } from 'src/app/shared/util/RouteData';

import { DocumenteEditorComponent } from '../outLetter/documente-editor/documente-editor.component';


@Component({
  selector: 'app-letter-template',
  templateUrl: './letter-template.component.html',
  styleUrls: ['./letter-template.component.scss']
})
export class LetterTemplateComponent implements OnInit {
  
  menuItems = [];
  editItem: any = {};
  dataToPostBody: DataToPost;
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;
  @ViewChild(DocumenteEditorComponent) childcmp:DocumenteEditorComponent;
  constructor(private route: ActivatedRoute,public service: ServiceCaller
    ,public router: Router, private routeData: RouteData) { 

    this.route.queryParams.subscribe(params => {
      this.editItem.LETTER_TEMP_ID = params['LETTER_TEMP_ID'];
  });
  this.menuItems=[ {
    name: "save",
    icon: "fa fa-floppy-o green",
    text: ' ذخیره ',
    visible:  true
  },

  {
    name: "cancel",
    text: 'انصراف',
    icon: "fa fa-ban red",
    visible: true
  }   
  ]
  }

  ngOnInit(): void {
    this.loadLetter();
  }

  onMenuItemClick(name) {
    if (name == "cancel") {
        this.router.navigate(["ofa/ofa-letter-template-list"]);
    }
    if (name == "save") {        
          this.Save()    
    }
  }

  Save(){

    var result = this.form.instance.validate();
    if (result.isValid) 
    {    
    this.childcmp.saveDocument('ofa',this.editItem.LETTER_TEMP_MAIN_FILE_ID).then((data) => {

    if (data==Guid.empty) 
    {
        Notify.error('خطا در بارگزاری متن نامه');
        return;
    }
    this.editItem.LETTER_TEMP_MAIN_FILE_ID = data.fileid;

      this.dataToPostBody = {
        'Data': {
          'SPName': '[OFA].[OFA_Sp_LETTER_TEMPLATE]',
          'Data_Input': { 'Mode': this.editItem.LETTER_TEMP_ID?2:1,          
           'Header': this.editItem
          , 'Detail': {}
        }
      }
    }
      
      this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
      then((data) => {
        this.editItem=data.ReturnData.Data_Output[0].Header[0];     
        Notify.success('اطلاعات با موفقیت ذخیره شد');
      });
    


  }); 
 
    }
  }

  loadLetter(){
    if (!this.editItem.LETTER_TEMP_ID)
    {
      return;
    }
    this.dataToPostBody = {
      'Data': {
        'SPName': '[OFA].[OFA_Sp_LETTER_TEMPLATE]',
        'Data_Input': { 'Mode': 4,          
         'Header': this.editItem
        , 'Detail': '', 'InputParams': '' }
      }
      
    }
    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.editItem=data.ReturnData.Data_Output[0].Header[0];  
        this.childcmp.openDocument(this.editItem.FILE_PATH,this.editItem.FILE_NAME);        
      }
      
    });


   };

}
