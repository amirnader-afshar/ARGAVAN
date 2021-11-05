import { Component, OnInit,ViewChild } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';

import { TranslateService } from "../../services/TranslateService";
import { ConfigService } from '../../services/ConfigService';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('form', {static: false}) form: DxValidationGroupComponent;
  editItem: any = {};
  confirmPassword: string;
  password: string;
  mobileNumber:string;
  isLoading: boolean = false;
  private readonly simple = /\w{3,20}/;
  private readonly complex = /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
  phonePattern: any =  "09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}"

  phoneRules = [{
    type: 'required',
    message: this.translate.instant("PUB_REQUIRED")
  },
  {
    type: 'pattern',
    pattern: this.phonePattern,
    message: this.translate.instant("ADM_PHONE_INVALID")
  }];
  
passswordRules = [{
  type: 'required',
  message: this.translate.instant("PUB_REQUIRED")
},
{
  type: 'pattern',
  pattern: this.configService.get('ADM-SEC-PASS-CXTY') == '1' ? this.complex : this.simple,
  message: this.translate.instant("ADM_PASS_CXTY")
}];

confirmRules = [{
  type: 'required',
  message: this.translate.instant("PUB_REQUIRED")
}, {
  type: 'compare',
  comparisonTarget: () => {
      return this.password;
  },
  message: this.translate.instant("ADM_PASS_COMPARE")
}];


  constructor(private translate: TranslateService,private configService: ConfigService,private authService: AuthService) { }

  ngOnInit(): void {
  }

  signup() {
      if (this.isLoading)
        return;
      var result = this.form.instance.validate();
      if (result.isValid) {
        this.isLoading = true;
            this.editItem = {Username:this.mobileNumber,DisplayName:this.mobileNumber,Password:this.password
                            ,Mobile:this.mobileNumber,Enabled:1}
            this.authService.signup(this.editItem).then(() => {
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        }
    }

}
