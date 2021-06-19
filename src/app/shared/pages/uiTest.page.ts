import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input
} from "@angular/core";
import CustomStore from "devextreme/data/custom_store";
import { ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { ServiceCaller } from "../services/ServiceCaller";
import { Deferred } from "../Deferred";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import { TranslateService } from "../services/TranslateService";
import { BasePage } from "../BasePage";
import { Dialog, Notify } from "../util/Dialog";
import {
  DxDataGridComponent,
  DxValidationGroupComponent
} from "devextreme-angular";
import { PermissionService } from "../permission";
import { DateTime, DateTimeFormat } from "../util/DateTime";
import { DXLovComponent } from "../components/dx-lov.component";
@Component({
  selector: "ui-page",
  templateUrl: "./uiTest.page.html"
})
export class UiTestPage extends BasePage {
  lessMode: boolean = false;
  advancedSearchMode: boolean = false;
  moreText: string = "بیشتر";
  popupVisible: boolean = false;
  fullscreen: boolean = false;
  searchVisible:boolean=false;
  fileExplorerVisible: boolean = false;
  toolbarItems: any[] = [
    {
      location: "before",
      widget: "dxButton",
      options: {
        type: "back",
        text: "Back",
        onClick: () => {
          notify("Back button has been clicked!");
        }
      }
    }
  ];
  dataSource: any[] = [
    {
      work: "انجام استاندارد سازی UI",
      des: "بررسی نیازمندی های ui",
      date: "1397/02/01",
      priority: "زیاد",
      status: "در حال انجام"
    }
  ];
  menuItems: any[] = [
    {
      name: "Back",
      icon: "fa fa-chevron-right blue",
      visible: true
    },
    {
      name: "Refresh",
      icon: "fa fa-refresh blue",
      visible: true
    },
    {
      name: "New",
      text: "جدید",
      icon: "fa fa-plus green",
      visible: true
    },
    {
      name: "Cancel",
      text: "انصراف",
      icon: "fa fa-ban red",
      visible: true
    },
    {
      name: "Save",
      text: "ذخیره",
      icon: "fa fa-floppy-o green",
      visible: true
    },
    {
      name: "Delete",
      text: "حذف",
      icon: "fa fa-trash red",
      visible: true
    },
    {
      name: "Approved",
      text: "تایید",
      icon: "fa fa-check-circle green",
      visible: true
    },
    {
      name: "Actions",
      text: "&nbsp",
      icon: "fa fa-bars",
      visible: true,
      items: [
        {
          name: "choose",
          text: "گزینه اول"
        }
      ]
    },
    {
      name: "Search",
      icon: "fa fa-search",
      visible: true
    },
    {
      name: "Search",
      text: "جستجوی پیشرفته",
      icon: "fa fa-search",
      visible: true
    },
    {
      name: "FileExplorer",
      icon: "fa fa-folder red",
      visible: true
    },
    
  ];
  tabs:any[]=[  {     
    id: 0,
    text: "user", 
    icon: "user", 
    content: "User tab content" 
},
{ 
    id: 1,
    text: "comment", 
    icon: "comment", 
    content: "Comment tab content" 
},
{ 
    id: 2,
    text: "find", 
    icon: "find", 
    content: "Find tab content" 
}]
  onMenuItemClick(name) {
    if (name == "New") {
      this.popupVisible = true;
      console.log("clicked", this.popupVisible);
    }
    if (name == "Search") {
      this.searchVisible = true
    }

    if (name == "FileExplorer") {
      this.fileExplorerVisible = true
    }

  }
  advancedSearch() {
    this.advancedSearchMode = !this.advancedSearchMode;
    this.advancedSearchMode
      ? (this.moreText = "کمتر")
      : (this.moreText = "بیشتر");
  }
  onPopupClose() {
    // alert("بسته شد");
  }
  onPopupOpen() {
    // alert("باز شد");
  }
  cancelPopup() {
    this.popupVisible = false;
  }
  popupItems: any = [
    {
      name: "New",
      text: "جدید",
      icon: "fa fa-plus green",
      visible: true
    },
    {
      name: "Approved",
      text: "تایید",
      icon: "fa fa-check-circle green",
      visible: true
    },
    {
      name: "Delete",
      text: "حذف",
      icon: "fa fa-trash red",
      visible: true
    },
    {
      name: "Save",
      text: "ذخیره",
      icon: "fa fa-floppy-o green",
      visible: true
    },
    {
      name: "Refresh",
      icon: "fa fa-refresh blue",
      visible: true
    },
    {
      name: "Search",
      icon: "fa fa-search",
      visible: true
    },
    {
      name: "Actions",
      text: "&nbsp",
      icon: "fa fa-bars",
      visible: true,
      items: [
        {
          name: "choose",
          text: "گزینه اول"
        }
      ]
    }
  ];
  confimClick() {
    alert("confirmed");
  }
  ClickAndNext() {
    alert("next --->");
  }
  search(){
    alert("search --->");
    
  }
  selectSearch(){
    alert("selected");
    
  }
  clicked(){
    alert("Clicked !")
  }
}

