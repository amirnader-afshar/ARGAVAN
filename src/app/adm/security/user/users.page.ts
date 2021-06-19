import { Component, ViewChild } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { BasePage } from '../../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { ADMPrivilegePopupPage } from './privileges.popup';
import { CoreService } from '../../../shared/services/CoreService';


@Component({
    templateUrl: './users.page.html',
})

export class ADMUsersPage extends BasePage {

    AddPrivilagesPopup: boolean = false;
    selectedRowId: string = null;
    selectedKeys: any = [];
    @ViewChild(DxDataGridComponent,{static: false}) dataGrid: DxDataGridComponent;

    menuItems = [
        {
            name: "New",
            icon: "fa fa-plus green",
            text: this.core.translate.instant("PUB_NEW"),
            visible: true,
        }
    ];

    gridItems = [
        {
            name: "Privilages",
            text: this.core.translate.instant('PUB_PERMISSIONS'),
            icon: "fa fa-hand-pointer-o green",
        },
        {
            name: "Unlock",
            text: 'رفع مسدودی حساب کاربری',
            icon: "fa fa-unlock-alt green",
        }
    ];


    constructor(public core: CoreService, public router: Router) {
        super(core.translate);
    }

    selectionChangedHandler() {
        if (this.selectedKeys.length == 1) {
          this.selectedRowId = this.selectedKeys[0];
        }
        else {
          this.selectedRowId = null;
        }
      }

    onMenuItemClick(name) {
        if (name == "New") {
            this.router.navigate(["adm/sec/user/edit"]);
        }
    }

    onGridItemClick(e) {
        if (e.name == "Unlock") {
            this.core.dialog.confirm().okay(() => {
                this.core.http.postPromise('/ADM/Security/User/Unlock', { UserId: e.data.ID }).then(() => {
                    this.core.notify.success();
                });
            });
        }
        if (e.name == "DXInsert") {
            this.router.navigate(["adm/sec/user/edit"]);
            e.handled = true;
        }
        if (e.name == "DXEdit") {
            this.router.navigate(["adm/sec/user/edit"], { queryParams: { id: e.data.ID } });
            e.handled = true;
        }
        if (e.name == "Privilages") {
            if (e.data != undefined) {
                this.AddPrivilagesPopup = true;
                // this.core.popup.open(ADMPrivilegePopupPage,
                //     {
                //         width: "800",
                //         height: "600",
                //         data: { itemId: e.data.ID, level: "user" }
                //     });
            }
        }
    }
}
