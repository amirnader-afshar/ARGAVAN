import { Component, ViewChild } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { ServiceCaller } from "../../../shared/services/ServiceCaller";
import { TranslateService } from "../../../shared/services/TranslateService";
import { BasePage } from "../../../shared/BasePage";
import {
  DxValidationGroupComponent, DxTextBoxComponent
} from "devextreme-angular";
import { Router, ActivatedRoute } from "@angular/router";
import { Notify } from "../../../shared/util/Dialog";
import { CoreService } from "../../../shared/services/CoreService";
import { FileGroup } from "../../../shared/components/fileExplorer/fileexplorer.util";

@Component({
  selector: "adm-page-user",
  templateUrl: "./user.page.html"
})
export class ADMEditUserPage extends BasePage {

  @ViewChild(DxValidationGroupComponent,{static: false}) form: DxValidationGroupComponent;
  @ViewChild('tbxPass',{static: false}) tbxPass: DxTextBoxComponent;
  @ViewChild('tbxPassvalidator',{static: false}) tbxPassvalidator;

  menuItems = [
    {
      name: "Save",
      icon: "fa fa-floppy-o green",
      text: "ذخیره ",
      visible: true
    }
  ];

  editItem: any = {};
  selectedId: any = {};
  readOnlyUsername: boolean = false;


  constructor(
    public service: ServiceCaller,
    public translate: TranslateService,
    public core: CoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(translate);
    this.route.queryParams.subscribe(params => {
      
      this.selectedId = params["id"];
      if (this.selectedId) {
        this.service.getPromise("/ADM/Security/User/Get", { id: this.selectedId }).then(
          data => {
            this.editItem = data;
            this.readOnlyUsername = true;
          });
      } else {
        this.editItem = {};
        this.selectedId = null;

      }
    });
  }

  ngAfterViewInit() {
    if (this.tbxPass.instance && !this.selectedId) {
      let validator = this.tbxPassvalidator;
      var rules: any[] = [];
      rules.push({ type: "required", message: "این فیلد اجباری است" })
      validator.option("validationRules", rules);
    }
  }

  navToSave() {
    this.router.navigate(["adm/sec/users"]);
  }

  onSignatureClick(e) {
    this.core.fileExplorer.open({ entityId: this.editItem.ID, fileGroup: FileGroup.Signature}).then((data) => {
      console.log(data);

    });
  }

  onMenuItemClick(name) {
    if (name == "Save") {
      var result = this.form.instance.validate();
      if (result.isValid) {
        if (this.selectedId == "" && (this.editItem.Password == null)) {
          Notify.error('پسورد وارد شده صحیح نمی باشد');
        } else {
          this.service.postPromise("/ADM/Security/User/Save", this.editItem).then(
            () => {
              Notify.success();
              this.navToSave();
            });
        }
      }
    }
  }
}
