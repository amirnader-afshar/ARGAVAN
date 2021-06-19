import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { AuthService } from '../services/AuthService';
import { TranslateService } from "../services/TranslateService";
import { ConfigService } from '../services/ConfigService';

@Component({
    templateUrl: './setpass.page.html',
    host: { '(window:keyup)': 'hotkeys($event)' },
})
export class ResetPasswordPage {

    @ViewChild('form', {static: false}) form: DxValidationGroupComponent;

    confirmPassword: string;
    password: string;
    isLoading: boolean = false;

    private readonly simple = /\w{3,20}/;
    private readonly complex = /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private translate: TranslateService) {
    }

    hotkeys(e) {
        if (e.key == "Enter") {
            this.reset();
        }
    }

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

    reset() {
        if (this.isLoading)
            return;
        var result = this.form.instance.validate();
        if (result.isValid) {
            this.isLoading = true;
            this.authService.restPassword(this.password).then(() => {
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        }
    }
}

