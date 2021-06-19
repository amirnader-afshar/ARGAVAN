import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import CustomStore from "devextreme/data/custom_store";
import ArrayStore from "devextreme/data/array_store";
import "rxjs/add/operator/toPromise";
import { ServiceCaller } from "../../../shared/services/ServiceCaller";
import { Deferred } from "../../../shared/Deferred";
import { confirm } from "devextreme/ui/dialog";
import { TranslateService } from "../../../shared/services/TranslateService";
import { BasePage } from "../../../shared/BasePage";
import {
  DxDataGridComponent,
  DxValidationGroupComponent
} from "devextreme-angular";
import { RouteData } from "../../../shared/util/RouteData";
import { Router, ActivatedRoute } from "@angular/router";
import { Notify } from "../../../shared/util/Dialog";

@Component({
  selector: "adm-page-company",
  templateUrl: "./company.page.html"
})
export class ADMEditCompanyPage extends BasePage implements OnInit {
  @ViewChild(DxDataGridComponent,{static: false}) dataGrid: DxDataGridComponent;
  @ViewChild(DxValidationGroupComponent,{static: false}) form: DxValidationGroupComponent;

  ngOnInit(): void {

     
    var param: any = {};
    param.ID = this.selectedID;
    this.userId = this.selectedID;

    this.service.get(
      "/ADM/Security/CompanyManagement/List",
      data => {
        this.listGroup = data;
      },
      param
    );

  }
  ngafterInit(): void {
     
  }
  menuItems = [
    {
      name: "New",
      icon: "fa fa-plus green",
      text: "جدید ",
      visible: true
    },
    {
      name: "Save",
      icon: "fa fa-floppy-o green",
      text: "ذخیره ",
      visible: true
    },

  ];

  list: any[];
  listGroup: any = [];
  editItem: any = {};
  newuser: any = {};
  userId: any = {};
  tabVisible: boolean = true;
  selectedID: any = {};
  readOnlyUsername: boolean = false;
  listID: any = [];
  ChkSelectedKeys: any = [];
  licenses: any[];
  tabItems = [
    {
      id: 0,
      text: "گروه های کاربری",
      icon: "fa fa-user"
    },
    {
      id: 1,
      text: "مجوزات",
      icon: "fa fa-star-half-o"
    },
    {
      id: 2,
      text: "تنظیمات",
      icon: "fa fa-gear"
    },
    {
      id: 3,
      text: "فعالیت",
      icon: "fa fa-history"
    }
  ];

  selectedTab = 0;

  selectTab(e) {
    this.selectedTab = e.itemData.id;
  }
  constructor(
    public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(translate);

    this.route.queryParams.subscribe(params => {
      if (params["ID"] != null) {
        this.selectedID = params["ID"];
        var param: any = {};
        param.ID = params["ID"];
        this.service.get(
          "/ADM/Security/CompanyManagement/Get",
          data => {
            debugger
            this.editItem.ID = data.ID;
            this.editItem.CompanyName = data.CompanyName;
            this.editItem.CompanyType = data.CompanyType;
            this.editItem.EconomyCode = data.EconomyCode;
            this.editItem.Location = data.Location;
            this.editItem.locationName = data.locationName;
            this.editItem.ManagerName = data.ManagerName;
            this.editItem.NumberRange = data.NumberRange;
            this.editItem.Phone1 = data.Phone1;
            this.editItem.Phone2 = data.Phone2;
            this.readOnlyUsername = true;
            Object.assign(this.editItem, data);
          },
          param
        );
      } else {
        this.editItem = {};
        this.selectedID = null;
      }
    });

    this.service.get(
      "/SYS/FORMS/List",
      data => {
        this.list = data.Data;
      },
      { Code: "LOV-ADM-001" }
    );
  }

  navToSave() {
    this.router.navigate(["stp/companies"]);
  }


  onMenuItemClick(name) {
    if (name == "Save") {
      var result = this.form.instance.validate();
      
        var param: any = {};
          param.CompanyName = this.editItem.CompanyName;
          param.CompanyType = this.editItem.CompanyType;
          param.EconomyCode = this.editItem.EconomyCode;
          param.Location = this.editItem.Location;
          param.ManagerName = this.editItem.ManagerName;
          param.NumberRange = this.editItem.NumberRange;
          param.ID = this.editItem.ID;
          param.CompanyId = this.selectedID;
          param.Phone1 = this.editItem.Phone1;
          param.Phone2 = this.editItem.Phone2;
          
          this.service.post(
            "/ADM/Security/CompanyManagement/Save",
            data => {
              Notify.success('اطلاعات با موفقیت ذخیره شد');
              this.navToSave();
            },
            param
          );

    }

    if (name == "New") {
      this.editItem = {};
      this.readOnlyUsername = false;
      this.selectedID = null;
      this.tabVisible = false;
      
    }
  }

  onChanged(e) {
    if (e.addedItems.length == 1) {
      this.listID.push(e.addedItems[0].ID);
    }
    if (e.removedItems.length == 1) {
      this.listID.pop(e.removedItems[0].ID);
    }
    console.log(this.listID);
  }
}
