import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
@Component({
    selector: 'adm-page-tables',
    templateUrl: './tables.page.html'
})
export class ADMTablesPage extends BasePage {

    @ViewChild('grid',{static: false}) dataGrid: DxDataGridComponent;

    filterItem: any = {};

    onGridItemClick(e) {

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
}
