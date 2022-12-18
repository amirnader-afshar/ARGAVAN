import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from '../../shared/Deferred';
import { DataToPost } from "../../shared/services/data-to-post.interface";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-edu-usercourse',
  templateUrl: './edu-usercourse.component.html',
  styleUrls: ['./edu-usercourse.component.scss']
})
export class EduUsercourseComponent extends BasePage implements OnInit {

  constructor(public translate: TranslateService, public router: Router
    , public service: ServiceCaller,private route: ActivatedRoute) {
    
    super(translate);      

  }
  editItem: any = {};
  userInfo : any={};
  user_ok :boolean=false;
  @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;
  dataSource: any = [];
  selectedRow: any = {};
  jasem: any = [];
  dataToPostBody: DataToPost;

  ngOnInit(): void {
    this.load_edu_personInfo();
    
  }
  clickToUserInfo(){
    this.router.navigate(["edu/edu-person-info"] ,{}  );
   }

   OnDataChange(childData: string){
    this.dataSource=null;
    this.loadGrid();
    }

  load_edu_personInfo(){

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
        this.userInfo=data.ReturnData.Data_Output[0].Header[0]; 
        this.user_ok=true;
        this.loadGrid();       
      }            
        });
   };



  loadGrid(){
    this.editItem.COURSE_ENABEL=true;
    this.editItem.TODAY_DATE=new Date;
    this.editItem.Mode = 5;
    this.editItem.USERINFO_CMPNY_ID =this.userInfo.PERSONINFO_UNION_ID;
    this.dataToPostBody = {
      'Data': {
        'SPName': '[EDU].[EDU_Sp_COURSE]',
        'Data_Input': { 'Mode': 5,          
         'Header': this.editItem
        , 'Detail': '', 'InputParams': '' }
      }
      
    }

    this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
    then((data) => {     
      if (data.ReturnData.Data_Output[0].Header.Header!='is Empty') {
        this.dataSource=data.ReturnData.Data_Output[0].Header;      
      }
      
    });  
   };

}
