import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { Router, ActivatedRoute } from '@angular/router'
import { TranslateService } from '../../../shared/services/TranslateService';
import { BasePage } from '../../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
    selector: 'adm-page-multiorganization',
    templateUrl: './multiorganization.page.html'
})
export class ADMMultiOrganizationPage extends BasePage implements OnInit {
    
    ngOnInit(): void {
        this.service.loadLovData("LOV-ADM-041", (data) => {
            this.Action = data;
        });
    }
    @ViewChild('grid',{static: false}) dataGrid: DxDataGridComponent;

    filterItem: any = {};
    Action: any = {};
    constructor(public service: ServiceCaller, public translate: TranslateService) {
        super(translate);
    }

    onRefreshClick(e)
    {
        this.dataGrid.instance.refresh();
    }

    onDataChange(e) {
        this.dataGrid.instance.refresh();
    }
}
