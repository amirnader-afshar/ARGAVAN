import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { RouteData } from '../../shared/util/RouteData';

@Component({
    selector: 'adm-page-report',
    templateUrl: './reportforms.page.html',
    providers: [ServiceCaller]
})
export class ADMReportFormsPage extends BasePage implements AfterViewInit {

    constructor(public service: ServiceCaller,
        public translate: TranslateService,
        private router: Router,
        private routeDate: RouteData) {

        super(translate);

    }
    ngAfterViewInit() {
        this.menuItems[2].visible = false;
        this.menuItems[1].visible = false;
        if (this.selectedKeys.length > 0) {
            this.selectionChangedHandler();
        }
    }
    
    @ViewChild(DxDataGridComponent,{static: false}) dataGrid: DxDataGridComponent;
    lessMode: boolean = true;
    lovFilter: any = { Type: null };
    searchitem: any = {};
    loadParams: any = {};
    selectedKeys: any = [];
    selectedRow: any = {};
    menuItems: any[] = [
        {
            name: "New",
            icon: "fa fa-plus",
            text: 'جدید',
            visible: true
        },
        {
            name: "Edit",
            icon: "fa fa-edit yellow",
            text: this.translate.instant("EDIT"),
            visible: true
        },
        {
            name: "Delete",
            icon: "fa fa-trash red",
            text: this.translate.instant("DELETE"),
            visible: true
        },
        {
            name: "Search",
            icon: "fa fa-search",
            text: 'جستجو ',
            visible: true
        },
        {
            name: "Refresh",
            icon: "fa fa-refresh blue",
            text: this.translate.instant("REFRESH"),
            visible: true
        },

    ];

    onDataChange(e) {
        this.lovFilter =
            {
                Type: e.ID
            };
    }
    onMenuItemClick(name) {
        if (name == "New") {
            this.router.navigate(["stp/reports/edit"], { queryParams: { ID: "" } });
        }
        if (name == "Search") {
            this.lessMode = !this.lessMode;
        }
        if (name == "Delete") {
        }

        if (name == "Refresh") {
            this.searchitem = {};
            this.loadParams.SourceTypeId = null;
            this.loadParams.Code = null;
            this.loadParams.Source = null;
            this.dataGrid.instance.refresh();
            
        }
        if (name == "Edit") {
            this.router.navigate(["stp/reports/edit"], { queryParams: { ID: this.selectedRow } });
   
        }
    }

    onSearchClick() {
        this.loadParams.SourceTypeId = this.searchitem.SourceTypeId;
        this.loadParams.Code = this.searchitem.Code;
        this.loadParams.Source = this.searchitem.Source;
        this.dataGrid.instance.refresh();
    }
    selectionChangedHandler() {
        if (this.selectedKeys.length == 0) {
            this.menuItems[1].visible = false;
            this.menuItems[2].visible = false;
        }
        else if (this.selectedKeys.length == 1) {
            this.menuItems[1].visible = true;
            this.menuItems[2].visible = true;
            this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0].ID;
        }
        else {
            this.selectedRow = {};
            this.menuItems[1].visible = false;
            this.menuItems[2].visible = true;
        }
    }
}
