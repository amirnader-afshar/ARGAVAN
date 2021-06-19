import { Component, Input, Output, EventEmitter, Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { RouteData } from '../util/RouteData';
import { Router } from '@angular/router';



@Component({
  selector: 'dx-report-button',
  templateUrl: "./dx-report.component.html",

})
@Injectable()
export class ReportButtonComponent {

  // form code
  @Input()
  formCode: string = null;


  // 
  @Output() paramsChange: EventEmitter<any>;

  private _params: any = {};

  @Input()
  get params(): any {


    return this._params;
  }
  set params(val: any) {
    this._params = val;
    if (val)
      this.paramsChange.emit(this._params);
  }

  constructor(private router: Router, private routeData: RouteData) {
    
    this.paramsChange = new EventEmitter<any>();
  }

  onbtnClick() {
    this.routeData.clear();
    
    this.routeData.push("formCode", this.formCode);
    this.routeData.push("params", this.params);
    //
    this.router.navigate(["/pub/report"]);
  }
}
