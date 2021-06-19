import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { Deferred } from '../../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../../shared/services/TranslateService';
import { BasePage } from '../../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { RouteData } from '../../../shared/util/RouteData';
import { Router, ActivatedRoute } from '@angular/router';
import { Notify } from '../../../shared/util/Dialog';


@Component({
  selector: 'adm-page-companies',
  templateUrl: './companies.page.html',

})

export class ADMCopmaniesPage extends BasePage implements OnInit {

  ngOnInit(): void {
    //this.dataGrid.instance.refresh();
  }

  @ViewChild(DxDataGridComponent,{static: false}) dataGrid: DxDataGridComponent;
  @ViewChild('form',{static: false}) form: DxValidationGroupComponent;

  menuItems = [

  ];

  gridItems = [
  ];

  selectedKeys: any = [];
  selectedRow: any = {};
  editItem: any = {};
  dataSource: any = {};
  popupVisible = false;
  localData: any = [];
  AddGroupPopup: boolean = false;
  list: any = [];
  listID: any = [];
  ChkSelectedKeys: any = [];

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    public router: Router,
    private routeDate: RouteData) {
    super(translate);
    //
    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        service.get("/ADM/Security/CompanyManagement/List", (data) => {
          deferred.resolve(data);
        });
        if (this.selectedKeys) {
          this.selectionChangedHandler();
        }
        return deferred.promise;
      },
      remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var list: any = [];
        list.push(key);
        this.service.post("/ADM/Security/CompanyManagement/Delete", (data) => {
          deferred.resolve(data);
        }, list)
        return deferred.promise;
      }
    });
  }

  selectionChangedHandler() {
    if (this.selectedKeys && this.selectedKeys.length == 1) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0].ID;
    }
    else {
      this.selectedRow = {};
    }
  }

  navToAddCompany() {
    this.router.navigate(["stp/companies/edit"]);
  }

  navToEditCompany() {
    this.router.navigate(["stp/companies/edit"], { queryParams: { ID: this.selectedRow } });
  }

  onMenuItemClick(name) {
  }

  onGridItemClick(e) {

    if (e.name == "DXInsert") {
      this.navToAddCompany();
      e.handled = true;
    }

    if (e.name == "DXEdit") {
      if (this.selectedKeys.length == 1) {
        this.navToEditCompany();
      }
      e.handled = true;
    }

  }

  onOkClick() {
    var param: any = {};
    param.companyId = this.selectedRow;
    param.ListGroupId = this.listID;
    this.service.post("/ADM/Security/CompanyManagement/Save", (data) => {
      Notify.success('عملیات با موفقیت انجام شد');
      this.AddGroupPopup = false;
    }, param);
  }



}
