
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
   
    templateUrl: './configdefinition.page.html',
    providers: [ServiceCaller]
})

export class ADMConfigDefinition extends BasePage implements OnInit {


    ngOnInit() {

        this.service.loadLovData("LOV-ADM-003", (data) => {
            this.dataTypeDataSource = data;
        });
        this.service.loadLovData("LOV-ADM-004", (data) => {
            this.controlTypDataSource = data;
        });
        this.service.loadLovData("LOV-ADM-055", (data) => {
            this.levelTypDataSource = data;
        });
        this.service.loadLovData("LOV-ADM-012", (data) => {
            this.schemaDataSource = data;
        });

    }

    @ViewChild(DxDataGridComponent,{static: false}) dataGrid: DxDataGridComponent;


    menuItems = [
    ];

    gridItems = [
    ];


    saveParams: any = {};
    LoadParams: any = {};
    dataTypeDataSource: any = {};
    controlTypDataSource: any = {};
    schemaDataSource: any = {};
    levelTypDataSource: any = {};
    editItem: any = {};
    dataSource: any = {};
    localData: any = {};
    selectedKeys: any = [];
    selectedRow:any={};
    searchItem: any = {};


    constructor(public service: ServiceCaller,
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute) {
        super(translate);
        this.dataSource.store = new CustomStore({
           
            key: "ID",
            load: (loadOptions) => {
                var param: any = {};
                param.configSchema = this.searchItem.SubSystem;
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.get("/ADM/Setup/ConfigDefinition/List", (data) => {
                    this.localData = data;
                    deferred.resolve(data);
                }, param);
                return deferred.promise;
            },
            insert: (values) => {
                 
                this.editItem.SchemaName =this.searchItem.SubSystem;
                let deferred: Deferred<any> = new Deferred<any>();
                if (this.searchItem.SubSystem != null) {
                    Object.assign(values, this.editItem) as any;
                    this.service.post("/ADM/Setup/ConfigDefinition/Save", (data) => {
                        deferred.resolve(data);
                    }, values);
                }
                else{
                    deferred.reject("نوع اسکیما ی مورد نظر را انتخاب کنید.");
                }
                return deferred.promise;
                
            },
            update: (key, values) => {
                this.editItem.SchemaName =this.searchItem.SubSystem;
                let deferred: Deferred<any> = new Deferred<any>();
                if (this.searchItem.SubSystem != null) 
                {
                    var editItem = this.localData.filter(c => c.ID == key)[0];
                    Object.assign(editItem, values);
                    this.service.post("/ADM/Setup/ConfigDefinition/Save", (data) => {
                        deferred.resolve(data);
                    }, editItem)
                }
                else
                {
                    deferred.reject("نوع اسکیما ی مورد نظر را انتخاب کنید.");
                }
                return deferred.promise;
                
            },
            remove: (key) => {
                let deferred: Deferred<any> = new Deferred<any>();
                var list: any = [];
                list.push(key);
                this.service.post("/ADM/Setup/ConfigDefinition/Delete", (data) => {
                    deferred.resolve(data);
                }, list);
                return deferred.promise;
            }
        });
    }


    onCellSubjectChanged(data, cell) {
        this.editItem.SubjectId = data.ID;
        cell.setValue(data.Title);
    }

    onSchemaChanged(data, cell) {
        this.editItem.SchemaName = data.Name;
    }

    onSearchClick() {
        this.dataGrid.instance.refresh();
    }

    selectionChangedHandler(){
        if (this.selectedKeys.length == 1)
        {
            this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
            this.editItem.SchemaName= this.selectedRow.SchemaName;
        }
    }
    onDataChange(e)
    {
       
        this.dataGrid.instance.refresh();
    }

}
