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

@Component({

    selector: 'adm-page-enumitems',
    templateUrl: './enum.page.html',
    providers: [ServiceCaller]
})

export class ADMEnumItemsPage extends BasePage implements OnInit {

    ngOnInit() {
    }

    newPopupVisibile: boolean = false;

    @ViewChild(DxDataGridComponent,{static: false}) dataGrid: DxDataGridComponent;
    @ViewChild(DxValidationGroupComponent,{static: false}) form: DxValidationGroupComponent;

    menuItems = [
        {
            name: "Add",
            icon: "fa fa-floppy-o green",
            text: 'ذخیره',
            visible: true
        },
        {
            name: "SaveNext",
            text: 'ذخیره و بعدی',
            icon: "fa fa-arrow-circle-o-right blue",
            visible: true
        }
    ];

    gridItems = [
        {}
    ];

    editItem: any = {};
    dataSource: any = {};
    localData: any = [];
    selectedKeys: any = [];
   


    navToForm() {
        this.router.navigate(["stp/enums"]);
    }

    onMenuItemClick(name) {
        if (name == "Add") {
            var result = this.form.instance.validate();
            if (result.isValid) {
                var param: any = {};
                param.SubSystem = this.editItem.SubSystem;
                param.Field = this.editItem.Field;
                param.EnumName = this.editItem.EnumName;
                param.Items = [];
                this.localData.filter(c => c.Flag != 3).forEach(t =>
                    param.Items.push({
                        ID: t.ID,
                        ItemName: t.ItemName,
                        ItemDictionary: t.ItemDictionary,
                        Sequence: t.Sequence,
                        Value: t.Value,
                    }));
                this.service.post("/ADM/Setup/ReferenceCodes/Save", (data) => {
                    this.navToForm();
                }, param);
            }

        }

        if (name == "SaveNext") {
            var result = this.form.instance.validate();
            if (result.isValid) {
                var param: any = {};
                param.SubSystem = this.editItem.SubSystem;
                param.Field = this.editItem.Field;
                param.EnumName = this.editItem.EnumName;
                param.Items = [];
                this.localData.filter(c => c.Flag != 3).forEach(t =>
                    param.Items.push({
                        ID: t.ID,
                        ItemName: t.ItemName,
                        ItemDictionary: t.ItemDictionary,
                        Sequence: t.Sequence,
                        Value: t.Value,
                    }));
                this.service.post("/ADM/Setup/ReferenceCodes/Save", (data) => {
                    this.editItem = {};
                    this.localData = [];
                    this.dataGrid.instance.refresh();
                }, param);
            }

        }
    }

    constructor(public service: ServiceCaller,
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute) {
        super(translate);

        this.route.queryParams.subscribe(params => {

            if (params['SubSystem'] != null && params['EnumName'] != null) {
                var param: any = {};
                param.SubSystem = params['SubSystem'];
                param.EnumName = params['EnumName'];
                this.service.get("/ADM/Setup/ReferenceCodes/GET", (data) => {
                    Object.assign(this.editItem, data);
                    this.localData = data.Items;
                    this.localData.forEach(s => s.Flag = 2);
                    this.dataGrid.instance.refresh();
                }, param);
            }
            else {
                this.editItem = {};
                this.localData = [];
                this.dataGrid.instance.refresh();
            }

        });




        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred: Deferred<any> = new Deferred<any>();
                deferred.resolve(this.localData.filter(s => s.Flag != 3));
                return deferred.promise;
            },
            insert: (values) => {
                let deferred: Deferred<any> = new Deferred<any>();
                Object.assign(values, { ID: Math.random() }) as any;
                //Object.assign(values, { ID: Math.random(), Flag: 1 }) as any;
                this.localData.push(values);
                deferred.resolve(true);
                return deferred.promise;

            },
            update: (key, values) => {
                let deferred: Deferred<any> = new Deferred<any>();
                Object.assign(this.localData.filter(c => c.ID == key)[0], values);
                deferred.resolve(true);
                return deferred.promise;
            },
            remove: (key) => {
                let deferred: Deferred<any> = new Deferred<any>();
                this.localData.filter(c => c.ID == key)[0].Flag = 3;
                deferred.resolve(this.localData.filter(s => s.Flag != 3));
                return deferred.promise;

            }
        });
    }

    onGridItemClick(e) {

    }
}
