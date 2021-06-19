import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../services/ServiceCaller';
import { Deferred } from '../Deferred';
import { TranslateService } from '../services/TranslateService';
import { BasePage } from '../BasePage';
import { Dialog, Notify } from '../util/Dialog';
import { DxDataGridComponent, DxTreeListComponent } from 'devextreme-angular';
import { Title } from '@angular/platform-browser';
import { Guid } from '../types/GUID';



@Component({
    selector: 'dform-page',
    templateUrl: './dform.page.html',
    host: { '(window:keydown)': 'hotkeys($event)' },
})

export class DynamicFormPage extends BasePage implements OnInit, AfterViewInit {
    menuItems = [
        {
            name: "New",
            icon: "fa fa-plus green",
            text: this.translate.instant("NEW"),
            visible: true,
        },
        {
            name: "Delete",
            text: this.translate.instant("DELETE"),
            icon: "fa fa-trash red",
            visible: true,
        },
        {
            name: "Refresh",
            icon: "fa fa-refresh blue",
            text: this.translate.instant("REFRESH"),
            visible: true,
        },
        {
            name: "DynamicForm",
            icon: "fa fa-smile-o",
            text: 'داینامیک فرم',
            visible: true,
        }
    ];


    // private TreeGrid: DxTreeListComponent;
    // @ViewChild('TreeGrid', { static: false }) set content1(content: DxTreeListComponent) {
    //     this.TreeGrid = content;
    //     setTimeout(() => {
    //         if (this.TreeGrid) {
    //             if (this.Is_Tree) {
    //                 this.grid = this.TreeGrid.instance;
    //                 // this.addColumns();
    //             }
    //         }
    //     }, 0);
    // }

    // private dataGrid: DxDataGridComponent;
    // @ViewChild('grid', { static: false }) set content2(content: DxDataGridComponent) {
    //     this.dataGrid = content;

    //     if (this.dataGrid) {
    //         if (!this.Is_Tree) {
    //             this.grid = this.dataGrid.instance;
    //             // this.addColumns();
    //         }
    //     }


    // }


    @ViewChild(DxDataGridComponent, { static: true }) grid: DxDataGridComponent;
    @ViewChild(DxTreeListComponent, { static: true }) TreeGrid: DxTreeListComponent;

    fields: any = [];
    saveApi: string;

    dataSource: any = {};
    popupVisible = false;

    isInEdit = false;
    formCode: string;
    isColumnConfig: number = 0;
    loadedLovData: any = {};

    Parent_Id_Field_Name = ''
    Parent_Id_Field_Type: number;
    Is_Tree = false;
    // grid: any;

    private sub: any;

    constructor(
        public service: ServiceCaller,
        public translate: TranslateService,
        private route: ActivatedRoute,
        private title: Title
    ) {
        super(translate);


    }


    // hotkeys(e) {
    //     if (e.key == "Insert" && e.ctrlKey) {
    //         this.dataGrid.instance.addRow();
    //     }
    //     // if (e.key == "Delete" && e.ctrlKey) {
    //     //      
    //     //     this.deleteSelectedRows();
    //     // }
    //     if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
    //         alert("search");
    //     }
    //     e.preventDefault();
    // }

    ngOnInit() {
        // this.grid = this.Is_Tree ? this.TreeGrid.instance : this.dataGrid.instance;
        this.title.setTitle('فرم های داینامیک');
        this.formCode = this.route.snapshot.data["code"];

        if (this.formCode != null) {
            this.configDataSource();
        }
        else {
            this.sub = this.route.params.subscribe(params => {
                this.formCode = params["code"];
                this.configDataSource();
            });
        }
    }

    ngAfterViewInit() {

    }


    configDataSource() {
        console.log(this.formCode);
        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.get("/SYS/Forms/List", (data) => {
                    console.log('data (GET)', data);

                    this.Is_Tree = data.Is_Tree;
                    if (this.Is_Tree) {
                        this.Parent_Id_Field_Name = data.Parent_Id_Field_Name;
                    }
                    this.fields = data.Fields;
                    this.saveApi = data.SaveApi;
                    this.addColumns();

                    deferred.resolve(data.Data);
                }, { code: this.formCode });

                return deferred.promise;
            },
            update: (key, values) => {
                console.log('key (update)', key);
                console.log('values (update)', values);
                let deferred: Deferred<any> = new Deferred<any>();
                if (this.saveApi) {
                    let row = this.grid.instance.getDataSource().items().filter(c => c.ID == key)[0];
                    let data: any = Object.assign(row, values);
                    this.service.post(this.saveApi, (result) => {
                        deferred.resolve(result);
                    }, data, (error) => {
                        deferred.reject(error);
                    });
                }
                else {
                    var fields = [];
                    for (var i in values) {
                        fields.push({ Name: i, Value: values[i] });
                    }
                    fields.push({ Name: 'ID', Value: key });
                    let data = {
                        ID: key,
                        FormCode: this.formCode,
                        Fields: fields
                    };
                    this.service.post("/SYS/Forms/Save", (result) => {
                        deferred.resolve(result);
                    }, data, (error) => {
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            },
            insert: (values) => {
                console.log('values >', values);

                let deferred: Deferred<any> = new Deferred<any>();

                if (this.saveApi) {
                    this.service.post(this.saveApi, (result) => {
                        deferred.resolve(result);
                    }, values, (error) => {
                        deferred.reject(error);
                    });
                }
                else {
                    var fields = [];
                    for (var i in values) {
                        if (i == this.Parent_Id_Field_Name) {
                            if (values[i] == 0) {
                                fields.push({ Name: i, Value: null });
                            }
                            else {
                                fields.push({ Name: i, Value: values[i] });
                            }
                        }
                        else { fields.push({ Name: i, Value: values[i] }); }

                    }
                    fields.push({ Name: 'ID', Value: values.ID });
                    var data = {
                        FormCode: this.formCode,
                        Fields: fields
                    };
                    this.service.post("/SYS/Forms/Save", (result) => {
                        deferred.resolve(result);
                    }, data, (error) => {
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            }
        });
    }


    addColumns() {

        if (this.isColumnConfig > 0) {
            return;
        }

        this.grid.instance.beginUpdate();
        this.TreeGrid.instance.beginUpdate();


        console.log("addColumns")
        console.log(this.fields)


        this.grid.instance.deleteColumn('ID');
        this.TreeGrid.instance.option('columns', []);

        //
        for (var i in this.fields) {
            var f = this.fields[i];
            var dataType: string = "string";
            var visible: boolean = true;
            if (f.Name == "ID")
                continue;

            if (this.Is_Tree) {
                if (f.Name == this.Parent_Id_Field_Name) {
                    this.Parent_Id_Field_Type = f.DataType
                    visible = false;
                }
            }

            let editorOptions: any = {};
            if (f.Format)
                editorOptions.format = f.Format;
            // boolean
            if (f.DataType == 1)
                dataType = "boolean";
            // Numeric
            else if (f.DataType == 2)
                dataType = "number";
            else if (f.DataType == 5)
                dataType = "Guid";
            // DateTime
            else if (f.DataType == 21)
                dataType = "dateTime";
            else if (f.DataType == 22)
                dataType = "date";
            else if (f.DataType == 23)
                dataType = "time";
            // other
            else
                dataType = "string";

            var col = {
                dataField: f.Name,
                caption: this.translate.instant(f.Title),
                width: f.Width,
                dataType: dataType,
                validationRules: f.Name != this.Parent_Id_Field_Name && f.Required == true && f.ControlType != 4 ? [{ type: "required", message: "این فیلد اجباری است" }] : null,
                allowEditing: f.AllowEdit,
                lookup: f.ControlType != 5 ? null : this.createLookupDataSource(f),
                minWidth: "100px",
                editorOptions: editorOptions,
                visible: visible
            };
            if (f.Width) {
                col.width = f.Width;
            }


            this.grid.instance.addColumn(col);
            this.TreeGrid.instance.addColumn(col);

        }


        this.grid.instance.endUpdate();
        this.TreeGrid.instance.endUpdate();

        this.isColumnConfig += 1;


    }

    cellTemplate(cell, field) {
        console.log("calculateDisplayValue");
        this.service.post("/SYS/Forms/List/Post", (data) => {
            console.log(data.Data[0]);
        }, { code: field.Lookup, Params: [{ Name: "ID", Value: cell.value }] });
    }

    createLookupDataSource(field): any {
        let item = {
            allowClearing: field.Required != true,
            dataSource: new CustomStore({
                key: "ID",
                load: (loadOptions) => {
                    // 
                    let deferred: Deferred<any> = new Deferred<any>();

                    if (this.loadedLovData[field.Lookup]) {
                        deferred.resolve(this.loadedLovData[field.Lookup]);
                    }
                    else {
                        this.service.get("/SYS/Forms/List", (data) => {
                            this.loadedLovData[field.Lookup] = data.Data;
                            deferred.resolve(data.Data);
                        }, { code: field.Lookup });
                    }
                    return deferred.promise;
                },
                byKey: (key) => {
                    let deferred: Deferred<any> = new Deferred<any>();
                    // this.service.get("/SYS/Forms/List", (data) => {
                    //     deferred.resolve(data.Data);
                    // }, { code: field.Lookup, Params: [{ Name: "ID", Value: key }] });
                    let founded = this.loadedLovData[field.Lookup].find(c => c.ID == key);
                    deferred.resolve(founded);

                    return deferred.promise;
                }
            }),
            displayExpr: "Title",
            valueExpr: "ID"
        };

        return item;
    }

    onContentReady(e) {
        // if (this.grid) {
        //     this.grid.columnOption("command:edit", "visible", false);
        // }

    }

    onEditingStart(e) {
        //console.log(e);
    }

    // selectionChangedHandler() {
    //     this.grid.addRow();

    //     let selectedKeys = this.dataGrid.instance.getSelectedRowKeys();
    //     this.menuItems[1].visible = selectedKeys.length > 1;
    // }

    onMenuItemClick(name) {
        if (name == "New") {
            if (this.Is_Tree) {
                this.TreeGrid.instance.addRow();
            }
            else { this.grid.instance.addRow(); }

        }
        //if (name == "Edit") {
        //    if (this.dataGrid.instance.getSelectedRowsData.length == 1) {
        //        var index = this.dataGrid.instance.getRowIndexByKey(this.dataGrid.instance.getSelectedRowsData[0].ID);
        //        this.dataGrid.instance.editRow(index);
        //    }
        //}
        if (name == "Refresh") {
            if (this.Is_Tree) {
                this.TreeGrid.instance.refresh();
            }
            else { this.grid.instance.refresh(); }

        }
        if (name == "Delete") {

            this.deleteSelectedRows();
        }

    }

    onGridMenuItemClick(e) {

        if (e.name == "DXDelete") {
            e.handled = true;
            this.deleteSelectedRows();
        }
        if (e.name == "DXSelectedDelete") {
            e.handled = true;
            this.deleteSelectedRows();
        }
    }


    deleteSelectedRows() {
        let selectedKeys;
        if (this.Is_Tree) {
            selectedKeys = this.TreeGrid.instance.getSelectedRowKeys();
        }
        else { selectedKeys = this.grid.instance.getSelectedRowKeys(); }



        console.log('selectedKeys : ', selectedKeys);

        if (!selectedKeys.length) {
            Notify.error("PUB_NO_ITEM_SELECTED")
            return;
        }

        Dialog.delete().done(() => {
            this.service.postPromise("/SYS/Forms/Delete", {
                FormCode: this.formCode,
                List: selectedKeys
            }).then(() => {
                this.onMenuItemClick('Refresh');
                Notify.success("PUB_ACTION_SUCCESS_MSG");
            });
        });
    }
}
