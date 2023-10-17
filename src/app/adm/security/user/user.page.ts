import { Component, ViewChild } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { DomSanitizer } from '@angular/platform-browser';


import { ServiceCaller } from "../../../shared/services/ServiceCaller";
import { TranslateService } from "../../../shared/services/TranslateService";
import { BasePage } from "../../../shared/BasePage";
import {
  DxValidationGroupComponent, DxTextBoxComponent
} from "devextreme-angular";
import { Router, ActivatedRoute } from "@angular/router";
import { Notify } from "../../../shared/util/Dialog";
import { CoreService } from "../../../shared/services/CoreService";
import { FileExplorerInputConfig, FileGroup, fileExtensionConvertor } from "../../../shared/components/fileExplorer/fileexplorer.util";
import { FileDto } from "src/app/shared/components/fileExplorer/Dtos/fileDto";
import { FileExplorerService } from "src/app/shared/components/fileExplorer/fileexplorer.service.proxy";

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
  AttachmentsFiles: FileDto = new FileDto();
  config: FileExplorerInputConfig = new FileExplorerInputConfig();

  constructor(private explorerService: FileExplorerService,
    public service: ServiceCaller,
    public translate: TranslateService,
    public core: CoreService,
    private router: Router,
    private route: ActivatedRoute,private _sanitizer: DomSanitizer
  ) {
    super(translate);
    this.route.queryParams.subscribe(params => {
      
      this.selectedId = params["id"];
      if (this.selectedId) {
        this.service.getPromise("/ADM/Security/User/Get", { id: this.selectedId }).then(
          data => {
            this.editItem = data;
            this.readOnlyUsername = true;
            this.editItem.sign_FILE_BASE64STRING = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.editItem.Sign_FILE_BASE64STRING);

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
    // this.core.fileExplorer.open({ tabelName:'ADM_USERS',entityId: this.editItem.ID, fileGroup: FileGroup.Signature}).then((data) => {
      
    //   this.editItem.SUSR_SIGN_FILE_ID = data[0].id;
    //   this.editItem.sign_FILE_BASE64STRING = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    //   + data[0].FILE_BASE64STRING); 
      
    // });

  }
  onChangeMain(e) {
    this.AttachmentsFiles.files = e.target.files;
    this.upload();
  }

  upload(): void {        
    this.AttachmentsFiles.fileGroup = FileGroup.Signature.toString();
    this.AttachmentsFiles.entityId = this.selectedId ;
    this.AttachmentsFiles.tabelName = "ADM_USERS";
    this.explorerService.uploadFile(this.AttachmentsFiles).then(res => {
        if (res!=null){
          console.log('res',res);
          this.editItem.SUSR_SIGN_FILE_ID = res.Result[0].ID;
          this.editItem.sign_FILE_BASE64STRING= this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
            + res.Result[0].FILE_BASE64STRING); 
        }            
    });  
}
fileExtensions(): string {
  let extensions = '';
  this.config.fileExtensions.forEach((item, index) => {
      extensions += fileExtensionConvertor(item) + ',';
  })
  if (extensions.endsWith(','))
      extensions.substr(extensions.length - 1);
  return extensions;
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
