import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { AuthService } from '../services/AuthService';
import { TranslateService } from "../services/TranslateService";

@Component({
    templateUrl: './login.page.html',
    host: { '(window:keyup)': 'hotkeys($event)' },
})
export class LoginPage {

    @ViewChild('form', {static: false}) form: DxValidationGroupComponent;

    username: string;
    password: string;
    isLoading: boolean = false;

    constructor(private router: Router, private authService: AuthService, private translate: TranslateService) {
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
            this.authService.login(this.username, this.password).then(() => {
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        }
    }

    signup() {
        this.router.navigate(['/signup']);
    }
}

