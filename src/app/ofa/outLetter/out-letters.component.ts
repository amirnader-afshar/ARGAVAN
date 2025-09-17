import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router,ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from '../../shared/Deferred';
import { DataToPost } from "../../shared/services/data-to-post.interface";

import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import dxTextBox from 'devextreme/ui/text_box';
import { ConfigService } from 'src/app/shared/services/ConfigService';

import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';



@Component({
  selector: 'app-out-letters',
  templateUrl: './out-letters.component.html',
  styleUrls: ['./out-letters.component.scss']
})

  export class OutLettersComponent extends BasePage implements AfterViewInit,OnInit {
    ngAfterViewInit(): void {
      
      this.menuItems[1].visible = false;
      this.menuItems[2].visible = false;
      

    }
    ngOnInit():void{
      this.editItem.LETTER_IN_OUT_TYPE = this.route.snapshot.data["LETTER_IN_OUT_TYPE"];   
      
      
      this.weekago= Number(this.confService.get('OFA-USER-LETTER_LIST_FILLTER_WEEK'));
      if (this.weekago==0) this.weekago=4;
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - (this.weekago*7));

      let day = String(twoWeeksAgo.getDate()).padStart(2, '0');
      let month = String(twoWeeksAgo.getMonth() + 1).padStart(2, '0');
      let year = twoWeeksAgo.getFullYear();       
      const beginDate = `${year}/${month}/${day}`;

      const now = new Date();
      day = String(now.getDate()).padStart(2, '0');
      month = String(now.getMonth() + 1).padStart(2, '0');
      year = now.getFullYear();
      const endDate = `${year}/${month}/${day}`;

      this.editItem.FLG_ENTERNAL = this.route.snapshot.data["FLG_ENTERNAL"];  
      this.editItem.archive = this.route.snapshot.data["archive"];       

      if (this.editItem.LETTER_IN_OUT_TYPE=='out' || this.editItem.FLG_ENTERNAL)
      {
        this.editItem.FILTER_BEGIN_LETTER_BOOK_DATE = beginDate; 
        this.editItem.FILTER_END_LETTER_BOOK_DATE = endDate;        
      }
      else if (this.editItem.LETTER_IN_OUT_TYPE=='in' ||!this.editItem.FLG_ENTERNAL)
      {
        this.editItem.FILTER_BEGIN_LETTER_DATE = beginDate; 
        this.editItem.FILTER_END_LETTER_DATE = endDate;        
      }      


      if (localStorage.getItem('OFA_FILTER_BEGIN_LETTER_BOOK_DATE') )
        this.editItem.FILTER_BEGIN_LETTER_BOOK_DATE=localStorage.getItem('OFA_FILTER_BEGIN_LETTER_BOOK_DATE');
      if (localStorage.getItem('OFA_FILTER_END_LETTER_BOOK_DATE') )
        this.editItem.FILTER_END_LETTER_BOOK_DATE=localStorage.getItem('OFA_FILTER_END_LETTER_BOOK_DATE');  
      if (localStorage.getItem('OFA_FILTER_BEGIN_LETTER_DATE') ) 
        this.editItem.FILTER_BEGIN_LETTER_DATE=localStorage.getItem('OFA_FILTER_BEGIN_LETTER_DATE');
      if (localStorage.getItem('OFA_FILTER_END_LETTER_DATE') ) 
        this.editItem.FILTER_END_LETTER_DATE=localStorage.getItem('OFA_FILTER_END_LETTER_DATE');  


      this.loadGrid();
    
      
    }
    
    weekago;
    editItem: any = {};
    @ViewChild('grid',{static: true}) dataGrid: DxDataGridComponent;
    
    dataSource: any = {};
    selectedRow: any = {};
    selectedRows: number[] = [];
    dataToPostBody: DataToPost;
    notSignedCount:number;
    notReadedCount:number;
    menuItems = [
      {
        name: "New",
        icon: "fa fa-plus green",
        text: 'جدید',
        visible: true
      },
      {
        name: "Edit",
        icon: "fa fa-edit green",
        text: 'ویرایش',
        visible: true
      },
      {
        name: "Delete",
        icon: "fa fa-trash red",
        text: 'حذف',
        visible: false
      },
      {
        name: "Refresh",
        icon: "fa fa-refresh blue",
        text: 'خالی کردن فیلترها',
        visible: true
      },{
        name: "archive",
        text: 'انتقال به آرشیو',
        icon: "fa fa-archive",
        visible: true}
    ]
  
  
    constructor(public translate: TranslateService, public router: Router
      , public service: ServiceCaller,private route: ActivatedRoute,private confService: ConfigService) {
              
      super(translate);      
      //locale('fa');

    }
  
    onExporting(e) {
        const workbook = new Workbook();    
        const worksheet = workbook.addWorksheet('Main sheet');
        exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            selectedRowsOnly: true
        }).then(function() {
            workbook.xlsx.writeBuffer()
                .then(function(buffer: BlobPart) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
                });
        });
        e.cancel = true; 
    }


   loadGrid(){

    this.dataSource = new CustomStore({
      key: "LETTER_ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.editItem.PageNumber=loadOptions.skip/loadOptions.take;
        this.editItem.filter={FILTER_BEGIN_LETTER_BOOK_DATE:this.editItem.FILTER_BEGIN_LETTER_BOOK_DATE,FILTER_END_LETTER_BOOK_DATE:this.editItem.FILTER_END_LETTER_BOOK_DATE};
        this.editItem.filter={...this.editItem.filter,FILTER_BEGIN_LETTER_DATE:this.editItem.FILTER_BEGIN_LETTER_DATE
          ,FILTER_END_LETTER_DATE:this.editItem.FILTER_END_LETTER_DATE}

      function setLocalStorage(key, value) {
        if (value === "undefined" || value === undefined || value === null || value === '' || value === 'null') {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
      }

        // استفاده:
        setLocalStorage('OFA_FILTER_BEGIN_LETTER_BOOK_DATE', this.editItem.FILTER_BEGIN_LETTER_BOOK_DATE);
        setLocalStorage('OFA_FILTER_END_LETTER_BOOK_DATE', this.editItem.FILTER_END_LETTER_BOOK_DATE);

        setLocalStorage('OFA_FILTER_BEGIN_LETTER_DATE', this.editItem.FILTER_BEGIN_LETTER_DATE);
        setLocalStorage('OFA_FILTER_END_LETTER_DATE', this.editItem.FILTER_END_LETTER_DATE);




        this.editItem.RowspPage=loadOptions.take;
        if (loadOptions.filter)
         {
          if (!Array.isArray(loadOptions.filter[0]))
           {
            this.editItem.filter[loadOptions.filter[0]] = loadOptions.filter[2];
           }
           else {
              loadOptions.filter.forEach(f => {
                if(Array.isArray(f))
                {

                  let result = this.editItem.filter.hasOwnProperty(f[0]);
                  if (result==false)
                    {
                      if(Array.isArray(f[0]))   
                        {
                          this.editItem.filter[f[0][0]] = f[0][2];
                        } 
                      else               
                        this.editItem.filter[f[0]] = f[2];
                    }
                }
              });
           }
        }

        this.dataToPostBody = {
          'Data': {
            'SPName': '[OFA].[OFA_Sp_letter]',
            'Data_Input': { 'Mode': 4,          
             'Header': this.editItem
            , 'Detail': '', 'InputParams': '' }
          }
          
        }        
        this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {     
          if (data.ReturnData.Data_Output[0].Header.data) {
            //this.dataSource=data.ReturnData.Data_Output[0].Header;  
            console.log("loadOptions", loadOptions);
            deferred.resolve({data:data.ReturnData.Data_Output[0].Header.data,
              totalCount: data.ReturnData.Data_Output[0].Header.TOTALCOUNT });  
              this.notSignedCount =   data.ReturnData.Data_Output[0].Header.COUNT_LETTER_NOT_SIGNED;   
              this.notReadedCount =   data.ReturnData.Data_Output[0].Header.COUNT_LETTER_NOT_READED;   
          }  
          else
          {
            deferred.reject("No data Found!");
            //this.dataGrid.instance.option('dataSource',[]);
          }        
        });
    

      
        
        return deferred.promise;        
      },
      }); 

   
  
   };
  
    onMenuItemClick(name,id) {
      var qp = {
        LETTER_ID: this.selectedRow.LETTER_ID 
        ,GRID_SOURCE:this.editItem.LETTER_IN_OUT_TYPE
        ,archive:this.editItem.archive
        ,FLG_ENTERNAL:this.editItem.FLG_ENTERNAL
      }
      var routPath = "";
      if(this.editItem.LETTER_IN_OUT_TYPE=='out')
       routPath="ofa/outLetter";
      else
        if(this.editItem.FLG_ENTERNAL)        
          routPath="ofa/enternalLetter";
        else
            routPath="ofa/inLetter";

      if (name == "New") {          
          this.router.navigate([routPath],{queryParams: qp});
        
      } else if (name == "Edit") {        
        if (id!="")
          {qp.LETTER_ID=id}
        this.router.navigate([routPath],{queryParams: qp});
      }
      else if (name=="Delete")
      {
        this.dataToPostBody = {
          'Data': {
            'SPName': '[OFA].[OFA_Sp_letter]',
            'Data_Input': { 'Mode': 3,          
             'Header': this.selectedRow
            , 'Detail': '', 'InputParams': '' }
          }
          
        }
    
        this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {     
          
            Notify.success("PUB_ACTION_SUCCESS_MSG");          
            this.loadGrid();          
          
        });
      }
      else if (name=="Refresh"){
        this.dataGrid.instance.state(null);                
        delete  this.editItem.FILTER_BEGIN_LETTER_BOOK_DATE;
        delete this.editItem.FILTER_END_LETTER_BOOK_DATE;

        delete  this.editItem.FILTER_BEGIN_LETTER_DATE;
        delete this.editItem.FILTER_END_LETTER_DATE;
      }
      else if (name=="archive"){
        this.dataToPostBody = {
          'Data': {
            'SPName': '[OFA].[OFA_Sp_BULK_ARCHIVE]',
            'Data_Input': { 'Mode': 5,          
             'Header':this.selectedRows
            , 'Detail': '', 'InputParams': '' }
          }
          
        }
    
        this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
        then((data) => {     
          if (data.ReturnData.Data_Output[0].Response==1) {
                  
            this.loadGrid();
            Notify.success('اطلاعات با موفقیت ذخیره شد');
          }
          
        });
      }
    }
    selectionChangedHandler() {
        console.log(this.selectedRows,'rows');
    }
  
    onRowPrepared(e) {
      if (e.rowType === "data") {
          if (e.data.LETTER_IS_READED) {
            e.rowElement.style.backgroundColor = 'rgb(102, 204, 255)';  
            e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");  
          }
          else{
            e.rowElement.style.backgroundColor = 'rgb(255, 207, 102)';  
            e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");  
          }
      }
  }

  }
   