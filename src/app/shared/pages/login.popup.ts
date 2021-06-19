import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { AuthService } from '../services/AuthService';
import { TranslateService } from "../services/TranslateService";
import { PopupBasePage } from '../BasePage';

@Component({
    templateUrl: './login.popup.html',
    host: { '(window:keyup)': 'hotkeys($event)' },
})
export class LoginPopup extends PopupBasePage implements OnInit {

    ngOnInit(): void {
        // localStorage.removeItem('token')
        // localStorage.removeItem('USER_DIS')
        // localStorage.removeItem('USER_DES')
        // localStorage.removeItem('USER_COM')
    }

    @ViewChild('form', {static: false}) form: DxValidationGroupComponent;

    username: string = localStorage.getItem('USER_NAM');
    password: string;
    isLoading: boolean = false;

    constructor(private router: Router, private authService: AuthService,
        public translate: TranslateService) {
        super(translate);
    }

    hotkeys(e) {
        if (e.key == "Enter") {
            this.login();
        }
    }

    usernameRules = [{
        type: 'required',
        message: this.translate.instant("PUB_REQUIRED")
    }];

    passswordRules = [{
        type: 'required',
        message: this.translate.instant("PUB_REQUIRED")
    }];

    login() {
        if (this.isLoading)
            return;
        var result = this.form.instance.validate();
        if (result.isValid) {
            this.isLoading = true;
            this.authService.login(this.username, this.password).then((r) => {
                this.popupInstance.result(r);
                this.popupInstance.close();
            }).catch((msg) => {
            }).then(c => {
                this.isLoading = false;
            });
        }
    }
}

