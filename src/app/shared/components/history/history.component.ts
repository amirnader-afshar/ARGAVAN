import { Component, OnInit, ViewChild, AfterViewInit,EventEmitter,Output } from '@angular/core';
import { TranslateService } from '../../services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { BasePage } from '../../BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { DataToPost } from "../../services/data-to-post.interface";
import { RouteData } from '../../util/RouteData';
import { HistoryService } from '../../../shared/services/HistoryService';



@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent  extends BasePage implements AfterViewInit,OnInit {

  ngAfterViewInit(): void {
      
    if (this.jasem.length > 0) {
      this.selectionChangedHandler();
    }
  }
  ngOnInit():void{
    this.loadGrid();
  }
  @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;
  dataSource: any = {};
  selectedRow: any = {};
  jasem: any = [];
  dataToPostBody: DataToPost;
  ID;
  spName;
  fieldName;
  fieldValue;
  letterType;
  editItem;
  menuItems=[ { name: "cancel",
                    text: 'بازگشت',
                    icon: "fa fa-arrow-left",
                    visible: true
                  }];

  constructor(public translate: TranslateService, public router: Router
    ,public historservice: HistoryService
    ,private routeData: RouteData,private route: ActivatedRoute) {
    
    super(translate);   
    this.editItem = this.routeData.pop('ofa_outLetter');
    this.route.queryParams.subscribe(params => {
      this.spName = params["spName"];
      this.fieldName=params["fieldName"];
      this.fieldValue=params["fieldValue"];
      this.letterType=params["letterType"];
    });       

  }

 loadGrid(){

  this.historservice.getHistory(this.spName,this.fieldName, this.fieldValue).then((data) => {
    if (data) {
      this.dataSource = data;
      this.dataGrid.instance.refresh();
    }
  })

 };


  selectionChangedHandler() {

 
  }
  onMenuItemClick(name) {

    if (name == "cancel") {

      if(this.letterType=='out')
        this.router.navigate(["ofa/outLetter"],{ queryParams: { LETTER_ID: this.editItem.LETTER_ID 
                                                                ,GRID_SOURCE:this.letterType} } );
      else  
        this.router.navigate(["ofa/inLetter"],{ queryParams: { LETTER_ID: this.editItem.LETTER_ID 
                                                              ,GRID_SOURCE:this.letterType} });
      
    }
  }


}