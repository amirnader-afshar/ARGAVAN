import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
@Component({
    selector: 'adm-page-logs',
    templateUrl: './logs.page.html'
})
export class ADMLogsPage extends BasePage {

    @ViewChild('grid',{static: false}) dataGrid: DxDataGridComponent;

    filterItem: any = {};


    menuItems = [
        {
            name: "Refresh",
            icon: "fa fa-refresh blue",
            visible: true
        }
    ];

    onMenuItemClick(name) {
        if (name == "Refresh") {
            this.filterItem.SearchQuery = "";
            this.filterItem.DateFrom = null;
            this.filterItem.DateTo = null;
            this.onRefreshClick('');
        }
    }

    constructor(public service: ServiceCaller, public translate: TranslateService) {
        super(translate);

    }
    onDataChange(e) {
        this.dataGrid.instance.refresh();
    }

    onApplyClick(e) {
        this.service.postPromise("/ADM/Setup/Tables/Config").then(data => {
            Notify.success();
        });
    }

    onRefreshClick(e) {
        this.service.postPromise("/ADM/Setup/Tables/Generate").then(data => {
            this.dataGrid.instance.refresh();
        });
    }

    openTab(data) {
        let tab = window.open('about:blank', '_blank');
        tab.document.write(data);
        tab.document.close();
    }

    trimText(data: string) {
        if (!data)
            return null;
        else {
            if (data.length > 100)
                return data.substring(0, 97) + '...';
            else return data;
        }
    }
}
