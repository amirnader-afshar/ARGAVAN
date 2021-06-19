import { Component, ViewChild, TemplateRef, ComponentRef } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../services/ServiceCaller';
import { TranslateService } from '../services/TranslateService';
import { BasePage } from '../BasePage';
import { Notify } from '../util/Dialog';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { PermissionService } from '../permission';

import { DXLovComponent } from '../components/dx-lov.component';
import { DemisPopupService } from '../components/popup/demis-popup-service';
import { LoginPopup } from './login.popup';
@Component({
    selector: 'test-page',
    templateUrl: './test.page.html',
    host: { '(window:keydown)': 'hotkeys($event)' },
})

export class TestPage extends BasePage {

    @ViewChild('lov', {static: false}) lov: DXLovComponent;
    @ViewChild('popup', {static: false}) _popup: TemplateRef<any>;
    @ViewChild('popup2', {static: false}) _popup2: TemplateRef<any>;
    @ViewChild('testPage', {static: false}) _testPage: ComponentRef<any>;
    fileIds: any = [];

    menuItems = [
        {
            name: "AddNew",
            icon: "fa fa-plus",
            text: this.translate.instant("تجدید"),
            visible: true,
        }
    ];

    clearDate() {
        this.dateObject.date = null;
    }

    dateObject: any = {};
    // {
    //     time: 111,
    //     date: new Date()
    // }

    room: any =
        {
            ID: 50
        }



    items: any[] =
        [
            {
                title: "Tab 0",
                index: 0,
                icon: "fa fa-eye"
            },
            {
                title: "Tab 1",
                index: 1,
                icon: "fa fa-plus"
            },
        ]




    @ViewChild(DxDataGridComponent, {static: false}) dataGrid: DxDataGridComponent;
    @ViewChild('form', {static: false}) form: DxValidationGroupComponent;
    lovParams: any = {
        // Type: 1,
        // Date: new Date().toISOString(),
        //Schema:"ADM"
        //p_param_id: '3E57C46E-C029-E811-80C3-005056976E02'
        //P_MMDS_ID : 'B6594777-953C-E811-80C3-005056976E02',
        // ORTP_ID: '1A8C50D4-8F48-E811-80C3-005056976E02',
        Type: 3
    };


    // lovData: any = [{
    //     ID: "2d630871-b1e7-e711-80c2-005056976e02"
    // }];

    lovData: any = "[ADM].[ADM_CONFIG_VALUES]";
    lovValue: any = "AccountLevel";

    constructor(
        private popup: DemisPopupService,
        public service: ServiceCaller,
        public translate: TranslateService,
        public permissionService: PermissionService,
    ) {
        super(translate);
        //this.dateObject.date = new Date(1985, 9, 26);
    }
    openDialog2() {

        this.popup.open(LoginPopup, {
            width: '500',
            height: '300',
            title: 'وارد شوید',
            data: { name: '123' },
        }).then(res => {
            debugger
        });
    }
    openDialog() {

        // test.onClosed
        // test.onShown
        // test.onSubmited

        // this.popup.open(this._popup, {
        //     width: '500',
        //     height: '500',
        //     title: 'هویج',
        //     data: { name: '123' },
        // });





        // let dialogRes = this.dialog.open(this._popup, {
        //     width: '500',
        //     height: '500',
        //     data: { name: 'salam' }
        // });

        // dialogRes.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed');
        //      
        // });
    }


    hotkeys(e) {
        if (e.key == "Insert") {
            this.form.instance.validate();

        }
        if (e.key == "Delete") {
        }
    }



    onMenuItemClick() {

        //this.lov.show();
        Notify.success("تست");
        // let result = this.form.instance.validate();
        // if (result.isValid) {
        // }
    }

    onDataChange(e) {
        console.log('onLovDataChange', e);
    }


    onLovValueChanged(e) {
        console.log('onLovValueChanged', e);
    }


}
