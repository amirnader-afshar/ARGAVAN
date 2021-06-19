
import { Component, OnInit, ViewChild } from '@angular/core';
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
    selector: 'adm-page-dynamicformitems',
    templateUrl: './dynamicformitems.page.html',
    providers: [ServiceCaller]
})

export class ADMDynamicFormItemsPage extends BasePage implements OnInit {


    ngOnInit() {
        this.service.loadLovData("LOV-ADM-003", (data) => {
            this.DataTypeDataSource = data;
        });
        this.service.loadLovData("LOV-ADM-004", (data) => {
            this.ControlTypDataSource = data;
        });
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
        }
    ];

    gridItems = [
        {}
    ];

    lovFilter: any = { Type: null };
    editItem: any = {};
    selectedKeys: any = [];
    dataSource: any = {};
    localData: any = [];
    DataTypeDataSource: any = {};
    ControlTypDataSource: any = {};


    navToForm() {
        this.router.navigate(["stp/forms"]);
    }

    onMenuItemClick(name) {
        if (name == "Add") {
            var result = this.form.instance.validate();
            if (result.isValid) {
                var param: any = {};
                param.SourceTypeId = this.editItem.SourceTypeId;
                param.Code = this.editItem.Code;
                param.Source = this.editItem.Source;
                param.Description = this.editItem.Description;
                param.Query = this.editItem.Query;
                param.Order = this.editItem.Order;
                param.AddApi = this.editItem.AddApi;
                param.ApiDelete = this.editItem.ApiDelete;
                param.ApiUpdate = this.editItem.ApiUpdate;
                param.ID = this.editItem.ID;
                var detailInsert: any = [];
                var detailUpdate: any = [];
                var detailDelete: any = [];

                //Insert
                this.localData.filter(i => i.Flag == 1).forEach(t =>
                    detailInsert.push({
                        ID: t.ID,
                        Sequence: t.Sequence,
                        Name: t.Name,
                        DisplayName: t.DisplayName,
                        CaptionName: t.CaptionName,
                        Format: t.Format,
                        ControlTypId: t.ControlTypeId,
                        DataTypeId: t.DataTypeId,
                        LovSource:t.LovSource,
                        IsValueField: t.IsValueField,
                        IsDisplayField: t.IsDisplayField,
                        Visible: t.Visible,
                        AllowInsert: t.AllowInsert,
                        AllowEdit: t.AllowEdit,
                        AllowNull: t.AllowNull,
                        ColumnWidth: t.ColumnWidth,
                    }));
                //Update
                this.localData.filter(i => i.Flag == 2).forEach(t =>
                    detailUpdate.push({
                        ID: t.ID,
                        Sequence: t.Sequence,
                        Name: t.Name,
                        DisplayName: t.DisplayName,
                        CaptionName: t.CaptionName,
                        Format: t.Format,
                        ControlTypId: t.ControlTypeId,
                        DataTypeId: t.DataTypeId,
                        LovSource:t.LovSource,
                        IsValueField: t.IsValueField,
                        IsDisplayField: t.IsDisplayField,
                        Visible: t.Visible,
                        AllowInsert: t.AllowInsert,
                        AllowEdit: t.AllowEdit,
                        AllowNull: t.AllowNull,
                        ColumnWidth: t.ColumnWidth,
                    }));

                //Delete
                this.localData.filter(i => i.Flag == 3).forEach(t =>
                    detailDelete.push(t.ID));

                var Items: any = {};
                Items.InsertedItems = detailInsert;
                Items.UpdatedItems = detailUpdate;
                Items.DeletedItems = detailDelete;
                param.Items = Items;
                this.service.post("/ADM/Setup/DynamicForm/Save", (data) => {
                    this.navToForm();
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
            if (params['ID'] != null) {
                var param: any = {};
                param.ID = params['ID'];
                this.service.get("/ADM/Setup/DynamicForm/Get", (data) => {
                    this.editItem.ID = data.ID;
                    Object.assign(this.editItem, data);
                    this.localData = data.Items;
                    this.localData.forEach(s => s.Flag = 2);
                    this.dataGrid.instance.refresh();
                }, param);
            }
            else {
                this.editItem = {};
                this.editItem.SourceTypeId = {};
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
                Object.assign(values, { ID: Math.random(), Flag: 1 }) as any;
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
    onDataChange(e) {
        this.lovFilter =
            {
                Type: e.ID
            };
    }

}
