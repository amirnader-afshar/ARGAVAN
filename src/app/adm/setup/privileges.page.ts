import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent, DxTreeViewComponent, DxTreeListComponent } from 'devextreme-angular';
import { RouteData } from '../../shared/util/RouteData';
import { Notify } from '../../shared/util/Dialog';
import { filter } from 'rxjs-compat/operator/filter';

import { config } from 'rxjs';
import { ADMPrivilegeComponent } from './privilages.component';

@Component({
    selector: 'adm-page-privileges',
    templateUrl: './privileges.page.html',
    providers: [ServiceCaller]
})

export class ADMPrivilegesPage extends BasePage {

 
    @ViewChild('prv',{static: false}) prv:ADMPrivilegeComponent;

    companyId: string;


    menuItems: any[] = [
        // {
        //     name: "Save",
        //     text: 'اعمال سطح دسترسی',
        //     icon: "fa fa-hand-pointer-o green",
        //     visible: true
        // }
    ];


    constructor
        (public serviceCaller: ServiceCaller,
        public translate: TranslateService,
    ) {
        super(translate);

    }


    onMenuItemClick(name) {
    }

    onCompanyChange(e) {
        this.companyId = e.ID;
    }

    onRefreshClick() {
        this.prv.reload();
    }

    onApplyClick()
    {
        this.prv.saveChanges();
    }

}
