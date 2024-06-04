import { Component, Input, Output, EventEmitter, Inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../services/ServiceCaller';
import { TranslateService } from '../services/TranslateService';
import { RouteData } from '../util/RouteData';
import { ActivatedRoute } from '@angular/router';
import { PrintComponent } from '../components/print.component';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { Notify } from '../util/Dialog';

const REPORTCOMPONENT = new WeakMap();
declare function print_pdf(url: string);


@Component({
  selector: 'dx-report',
  templateUrl: "./report.page.html",
})
export class ReportPage implements OnInit {
  @ViewChild("form", {static: false}) form: DxValidationGroupComponent;
  reportCode: string;

 
  ItemRules = [{
    type: 'required',
    message: "Test"
  }];

  constructor(@Inject(ServiceCaller) service: ServiceCaller, public print: PrintComponent, private translate: TranslateService, private route: ActivatedRoute, private routeData: RouteData, private _cdr: ChangeDetectorRef) {
    this.service = service;
    this.translate = translate;
    this.paramsChange = new EventEmitter<any>();
    REPORTCOMPONENT.set(ReportPage, this)
    //this.reportCode = this.route.snapshot.data["reportCode"];
    this.route.queryParams.subscribe(params => {

      this.reportCode = params['reportCode'];
  

  });

  }
  ngOnInit(): void {
    

    if (this.reportCode == undefined) {
      this.formCode = this.routeData.storage.formCode;
      this.params = this.routeData.storage.params;
    }
    else {
      this.formCode = this.reportCode;
    }
  }
  service: ServiceCaller;
  filter: any = {};
  groupDataSource: any = [];
  insertitem: any = {};
  iframe: any;
  paramValue: any;
  filename: any = '';
  filterReport: any;
  reportData: any = {};
  reportitems: any = [];
  Currentreport: string;
  HiddenCondition: boolean = true;
  urlret: string = "";
  CountItem: number = 0;
  list: any = [];
  localdata: any = [];
  dataSource: any = {};
  FilterCondition: any = { Code: null };
  Conditions: any = [];
  selectedItem: any;
  selectedCondition: any;
  ConditionValue: any = {};
  // Conditions = [{ Name: this.translate.instant("PUB_EQUAL"), ID: "1" }, { Name: this.translate.instant("PUB_SMALLER"), ID: "2" }, { Name: this.translate.instant("PUB_SMALLER_EQUAL"), ID: "3" }, { Name: this.translate.instant("PUB_NOTEQUAL"), ID: "4" },
  // { Name: this.translate.instant("PUB_GREATER"), ID: "5" }, { Name: this.translate.instant("PUB_GREATER_EQUAL"), ID: "6" }, { Name: this.translate.instant("PUB_BETWEEN"), ID: "7" }, { Name: this.translate.instant("PUB_LIKE"), ID: "8" }];

  LovCode: string = "";
  isDropDownBoxOpened = false;
  changeDropDownBoxValue = function (args) {
    this.isDropDownBoxOpened = false;
  }

  tabItems = [
    {
      id: 0,
      text: "شرایط",
    },
    {
      id: 1,
      text: "پیش نمایش ",
      disabled: true
    }
  ]
  selectedTab = 0;
  selectTab(e) {
    this.selectedTab = e.itemData.id;
  }
  menuItems = [

    {
      name: "AddCondition",
      icon: "fa fa-plus green",
      text: "شرایط",
      visible: true
    },
    {
      name: "Show",
      icon: "fa fa-search",
      text: "نمایش",
      visible: true
    },
    {
      name: "Print",
      icon: "fa fa-print",
      text: "چاپ",
      visible: true
    },
    {
      name: "Save",
      icon: "fa fa-floppy-o green",
      text: "ذخیره",
      visible: true
    }
  ];
  // form code
  @Input()
  formCode: string = '';
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

  getFilter() {
    debugger
    let that = REPORTCOMPONENT.get(ReportPage);
    let filter: any = {};
    that.reportData.Code = that.formCode;
    filter.Code = that.reportData.Code;
    let params = [];
    that.groupDataSource.forEach(i =>
      i.items.forEach(
        f => params.push({
          Name: f.Name, Value: (f.Value == "" ? null : f.Value), Operators: f.selectedCondition.ID, Required: f.Required, Type: f.Type
          , ReportParameterId: f.ParameterId
        }))
    );
    // for (var i in params) {
    //   if (params[i].Required && (params[i].Value == "" || params[i].Value == undefined)) {

    //     if (params[i].Type == 5) {
    //       this.ItemReq = true;
    //     }
    //     return false;
    //   }
    // }

    filter.Params = params;
    return filter;
  }

  getValidation(required: boolean) {
    if (required)
      return this.ItemRules;
    else
      return [];
  }

  ngAfterViewInit() {
    

    this.Currentreport = this.formCode;
    if (this.formCode == undefined) {
      this.formCode = this.reportData.Code;
    }
    this.FilterCondition = {
      Code: this.formCode
    };
    this.groupDataSource = [];
    let value = "";
    this.service.loadLovData("LOV-ADM-056", (data) => {
      this.Conditions = data;
      this.service.getPromise("/ADM/Report/ListParameter", { Code: this.formCode }).then((data) => {
        this.reportitems = data;
        for (var i in this.reportitems) {
          var id = this.reportitems[i].ParameterId;
          var lovname = this.reportitems[i].SourceLov;
          var title = this.reportitems[i].Title;
          var type = this.reportitems[i].Type;
          var group = this.reportitems[i].GroupName;
          var required = this.reportitems[i].Required;
          value = this.reportitems[i].Value;
          let temp = this.groupDataSource.find(e => e.Group == group)
          if (!temp) {
            this.groupDataSource.push({
              Group: group
            });
          }
          if (this.params != undefined && Object.keys(this.params).length > 0) {
            let parameterName = this.reportitems[i].Name;
            value = this.params[parameterName];
          }

          this.changeItem(group, {
            Value: value != undefined ? value : null,
            Name: this.reportitems[i].Name,
            Title: title,
            selectedCondition: this.Conditions[0],
            LovName: lovname,
            RelatedSource: [],
            IsDeleted: false,
            Type: type,
            ParameterId: id,
            Required: required
          })
        }
        this.CountItem = this.groupDataSource.length;
        this.localdata = JSON.parse(JSON.stringify(this.groupDataSource));
      });
    })
    this.list = this.groupDataSource;
    this._cdr.detectChanges();
  }

  changeItem(group, item) {
    this.groupDataSource.forEach(element => {
      if (element.Group == group) {
        if (!element.items)
          element.items = [];
        element.items.push(item);
      }
    });
  }
  onlovreport(e) {
    this.FilterCondition = {
      Code: "RPT-HTL-001"
    };
  }

  changeSelect(e, data) {
    debugger
    // var sel = this.Conditions.filter(f => f.ID == e.itemData.ID)[0];    
    this.groupDataSource.forEach(element => {
      debugger
      element.items.forEach(item => {
        if (item.ParameterId == data.ParameterId)
          item.selectedCondition = e.itemData
      });
    });

  }
  onMenuItemClick(name) {
    switch (name) {
      case "Show":
        {
          this.Show();
          break;
        }
      case "AddCondition":
        {
          this.AddCondition();
          break;
        }
      case "Print":
        {
          if (!this.getFilter()) {
            Notify.error('اطلاعات اجباری را وارد کنید');
          }
          else {
            this.print.printwithoutshow(this.getFilter);
          }

          break;
        }

      case "Save":
        {
          this.Save();
          break;
        }
    }
  }

  Save() {
    var result = this.form.instance.validate();
    if (result.isValid) {
      this.service.postPromise("/ADM/Report/Save", this.getFilter()).then(data => {
        Notify.success('PUB_ACTION_SUCCESS_MSG');
      });
    }
    else {
      Notify.error('اطلاعات اجباری را وارد کنید');
    }

  }
  printpdf() {
    let url = this.service.BaseURL + "/ADM/Report/print?FileName=" + this.filename + "&Code=" + this.formCode;
    print_pdf(url);
    // (<any>newWindow).open(url);
  }

  bindData() {
    var result = this.form.instance.validate();
    if (result.isValid) {
      this.service.postPromise("/ADM/Report/List", this.getFilter()).then((data) => {
        this.filename = data.FileName;
        this.service.getfile("/ADM/Report/GetFile?FileName=" + this.filename, (data) => {
          this.iframe = document.getElementById('iframeViewer');
          this.iframe.contentDocument.body.innerHTML = '';
          this.iframe.contentWindow.document.write(data.text());
          this.selectedTab = 1;
          this.tabItems[1].disabled = false;
        });
      });
    }
    else {
      Notify.error('اطلاعات اجباری را وارد کنید');
    }
  }

  Show() {
    this.bindData();
  }

  AddCondition() {
    if (this.CountItem < this.groupDataSource.length) {
      this.groupDataSource.find(f => {
        let finddeleted = f.items.find(i => i.IsDeleted == true);
        if (finddeleted != undefined) {
          finddeleted.IsDeleted = false;
          return true;
        }
      });
      this.CountItem = this.CountItem + 1;
    }
  }

  delete(item, i) {
    let dsdelete = this.groupDataSource[i].items.filter(f => f.Name == item.Name)[0];
    let lovTitle = this.localdata[i].items.filter(f => f.Name == item.Name)[0].Title;
    dsdelete.IsDeleted = true;
    dsdelete.Title = lovTitle;
    dsdelete.Value = null;
    this.CountItem = this.CountItem - 1;
  }

  onLovChange(e, i, j, item) {
    var itemDeleted = this.groupDataSource[i].items.filter(f => f.Name == e.Name)[0].IsDeleted;
    if (itemDeleted) {
      let dsdelete = this.groupDataSource[i].items.filter(f => f.Name == e.Name)[0];
      dsdelete.IsDeleted = false;
      this.delete(item, i);
    }
    else {
      let changeItem = this.groupDataSource[i].items.filter(f => f.Name == item.Name)[0];
      this.delete(item, i);
      this.CountItem = this.CountItem - 1;
    }
    if (e.Type != undefined && this.groupDataSource[i].items[j].Type != e.Type) {
      this.groupDataSource[i].items[j].Type = e.Type;
      var s = this.reportitems.filter(f => f.Name == e.Name)[0].Type;
      this.groupDataSource[i].items[j].lovname = e.LovName;
    }
  }
}
