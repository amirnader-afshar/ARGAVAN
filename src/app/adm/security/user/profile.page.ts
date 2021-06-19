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
import { EventsService } from "angular-event-service/dist";

@Component({
  selector: "adm-page-profile",
  templateUrl: "./profile.page.html"
})
export class ADMProfilePage extends BasePage implements OnInit {
  ngOnInit(): void {}
  menuItems = [
    {
      name: "Save",
      icon: "fa fa-floppy-o green",
      text: "ذخیره ",
      visible: true
    }
  ];

  editItem: any = {};
  userId: any = {};
  readOnlyUsername: boolean = false;
  informationVisible: boolean = true;
  settingVisible: boolean = false;
  historyVisible: boolean = false;
  themeItem = [
    {
      mode: 'normal',
      text: "پوسته معمولی"
    },
    {
      mode: 'compact',
      text: "پوسته فشرده"
    }
  ];
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

  constructor(
    public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private eventsService:EventsService
  ) {
    super(translate);
  }

  navToCancel() {
    this.router.navigate(["adm/security/users"]);
  }

  onMenuItemClick(name) {
    if (name == "Save") {
    }
  }
  onTabClick(e) {
    let item = e.element.id;
    switch (item) {
      case "info":
        this.informationVisible = true;
        this.settingVisible = false;
        this.historyVisible = false;
        console.log(item);

        break;
      case "setting":
        this.informationVisible = false;
        this.settingVisible = true;
        this.historyVisible = false;
        console.log(item);

        break;
      case "history":
        this.informationVisible = false;
        this.settingVisible = false;
        this.historyVisible = true;
        console.log(item);
    }
  }
  
  onThemeChanged(e) {
    this.eventsService.broadcast("theme",e.value);
  }
}
