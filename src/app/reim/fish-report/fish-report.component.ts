import { Component, OnInit, ViewChild } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ServiceCaller } from 'src/app/shared/services/ServiceCaller';


declare function print_pdf(url: string);
@Component({
  selector: 'reim-fish-report',
  templateUrl: './fish-report.component.html',
  styleUrls: ['./fish-report.component.scss']
})
export class FishReportComponent implements OnInit {

  editItem: any = {YEARE:1402};
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;

  months: string[] = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

  constructor(private service: ServiceCaller,) { }

  ngOnInit(): void {
  }

  genReport(e)
  {
    var result = this.form.instance.validate();
      if (result.isValid) 
        { 
          let that = this;
          let data = {
            'Data': {
              'SPName': '[dbo].[SP_GET_RAHNAMOON_EIM_FISH]',
              'PureSPName':'SP_GET_RAHNAMOON_EIM_FISH',
              'ReportFileAddressName':'~/Reports/FishReport.mrt',
              'ReportName':'گزارش فیش حقوقی',
              'Filename':'RecepReport',
              'Data_Input': { 'Mode': 1,          
              'Header': {SAL:this.editItem.YEARE,MAH:this.editItem.MONTH}
              , 'Detail': '', 'InputParams': '' }
            }
            
          }
          this.service.postPromise("/ADM/Report/GetBySPName", data).then(data => {                
            let url = that.service.BaseURL + "/ADM/Report/print?FileName=" + data.FileName + "&Code=0" ;
            print_pdf(url);        
          });
        }
  }

  onValueChanged(e: any) {   
    var indexInDataSource = e.component.getDataSource().items().indexOf(e.value); 
    this.editItem.MONTH = indexInDataSource+1;
  }
}
