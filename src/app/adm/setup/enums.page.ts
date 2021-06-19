import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { RouteData } from '../../shared/util/RouteData';
import { Notify, Dialog } from '../../shared/util/Dialog';

@Component({
    selector: 'adm-page-enums',
    templateUrl: './enums.page.html',
    providers: [ServiceCaller]
})

export class ADMEnumsPage extends BasePage implements AfterViewInit {

    ngAfterViewInit() {
        this.menuItems[2].visible = false;
        this.menuItems[1].visible = false;
        if (this.selectedKeys.length > 0) {
            this.selectionChangedHandler();
        }
    }

    @ViewChild(DxDataGridComponent,{static: false}) dataGrid: DxDataGridComponent;


    selectedKeys: any = [];
    selectedRow: any = {};
    lessMode: boolean = true;
    searchItem: any = {};
    lovFilter: any = { SCHEMA: null };

    loadParams: any = {};

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

    //filter lov
    onDataChange(e) {
        this.lovFilter =
            {
                SCHEMA: e.ID
            };
    }

    navToNew() {
        this.router.navigate(["stp/enums/edit"], { queryParams: { SubSystem: "", EnumName: "" } });
    }

    navToEdit() {
        this.router.navigate(["stp/enums/edit"], { queryParams: { SubSystem: this.selectedRow.SubSystem, EnumName: this.selectedRow.EnumName } });
    }

    onMenuItemClick(name) {

        if (name == "New") {
            this.navToNew();
        }

        if (name == "Search") {
            this.lessMode = !this.lessMode;
        }

        if (name == "Refresh") {
            this.searchItem = {};
            this.loadParams.EnumName = null;
            this.loadParams.SubSystem = null;
            this.dataGrid.instance.refresh();
        }

        if (name == "Edit") {
            this.navToEdit();
        }

        if (name == "Delete") {
            // var result = confirm(this.translate.instant("PUB_CONFIRM_DELETE"), this.translate.instant("PUB_CONFIRM"));
            // result.then((dialogResult) => {
            //     if (dialogResult) {
            //         this.service.post("/ADM/Setup/ReferenceCodes/Delete", (data) => {
            //             this.selectedKeys = [];
            //             this.dataGrid.instance.refresh();
            //             Notify.success('دیتای مورد نظر حذف شد');
            //         }, this.selectedKeys);
            //     }
            // });

            Dialog.delete().done(() => {
                this.service.post("/ADM/Setup/ReferenceCodes/Delete", (data) => {
                    this.selectedKeys = [];
                    this.dataGrid.instance.refresh();
                    Notify.success('دیتای مورد نظر حذف شد');
                }, this.selectedKeys);
            });
        }
    }

    constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private routeDate: RouteData) {

        super(translate);

    }

    selectionChangedHandler() {
        if (this.selectedKeys.length == 0) {
            this.menuItems[1].visible = false;
            this.menuItems[2].visible = false;
        }
        else if (this.selectedKeys.length == 1) {
            this.menuItems[1].visible = true;
            this.menuItems[2].visible = true;
            this.selectedRow.SubSystem = this.dataGrid.instance.getSelectedRowsData()[0].SubSystem;
            this.selectedRow.EnumName = this.dataGrid.instance.getSelectedRowsData()[0].EnumName;

        }
        else {
            this.selectedRow = {};
            this.menuItems[1].visible = false;
            this.menuItems[2].visible = true;
        }
    }

    onSearchClick() {
        this.loadParams.EnumName = this.searchItem.EnumName;
        this.loadParams.SubSystem = this.searchItem.SubSystem;
        this.dataGrid.instance.refresh();
    }
}
