import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import { ADMSubjectValuesPage } from './subject-values.popup';
import { CoreService } from '../../shared/services/CoreService';

@Component({
    templateUrl: './subjects.page.html',
    providers: [ServiceCaller]
})

export class ADMSubjectsPage extends BasePage {

    @ViewChild('Treegrid',{static: false}) dataGrid: DxDataGridComponent;

    selectedRow: any = {};
    SubjectsTypDataSource: any = {};
    dataSource: any = {};
    TreeViewDataSource: any = {};
    localData: any = [];
    ChangeParentPopup: boolean = false;
    service: ServiceCaller;
    selectedKeys: any = [];
    SelectedParentID: any;

    menuItems: any[] = [
        {
            name: "Refresh",
            text: 'به روز رسانی',
            icon: "fa fa-refresh blue",
            visible: true
        },
        {
            name: "ChengParent",
            icon: "fa fa-share yellow",
            text: 'انتقال به ...',
            visible: true
        }
    ];

    treeItems = [
        {
            name: "ChengParent",
            icon: "fa fa-share yellow",
            text: 'انتقال به ...',
            visible: true
        },
        {
            name: "SetValue",
            icon: "fa fa-lock red",
            text: 'دسترسی داده ...',
            visible: true
        },
    ];



    constructor(public core: CoreService) {
        super(core.translate, core.http);
        //
        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                var param: any = {};
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.get("/ADM/Setup/Subjects/ListTree", (data) => {
                    this.localData = data;
                    deferred.resolve(data);
                }, param)
                return deferred.promise;
            },
            update: (key, values) => {
                let deferred: Deferred<any> = new Deferred<any>();
                var editItem = this.localData.filter(c => c.ID == key)[0];
                Object.assign(editItem, values);
                this.service.post("/ADM/Setup/Subjects/Save", (data) => {
                    deferred.resolve(data);
                }, editItem, (error) => {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            insert: (values) => {
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.post("/ADM/Setup/Subjects/Save", (data) => {
                    deferred.resolve(data);
                }, values, (error) => {
                    deferred.reject(error);
                })
                return deferred.promise;
            }
            , remove: (key) => {
                let deferred: Deferred<any> = new Deferred<any>();
                var list: any = [];
                list.push(key);
                this.service.post("/ADM/Setup/Subjects/Delete", (data) => {
                    deferred.resolve(data);
                }, list)
                return deferred.promise;
            }
        });

        //tree list
        this.TreeViewDataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.get("/ADM/Setup/Subjects/ListTreeView", (data) => {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        });

        this.core.http.get("/SYS/FORMS/List", (data) => {
            this.SubjectsTypDataSource = data.Data;
        }, { Code: "LOV-ADM-020" });
    }


    onMenuItemClick(name) {
        if (name == "ChengParent") {
            this.moveItem();
        }
        if (name == "Refresh") {
            this.dataGrid.instance.refresh();
        }
    }

    moveItem() {
        if (this.selectedKeys.length == 1) {
            this.ChangeParentPopup = true;
        }
        else {
            this.ChangeParentPopup = false;
            Notify.error('لطفا child مورد نظر را انتخاب کنید');
        }
    }

    selectionChangedHandler() {
        if (this.selectedKeys.length == 1) {
            this.selectedRow = this.selectedKeys[0];
        }
        else {
            this.selectedRow = {};
        }
    }

    onGriddataSourceEditorPreparing(e) {
        if (e.dataField === "Color") {
            e.editorName = "dxColorBox";
            e.editorOptions.onValueChanged = function (v) {
                var value = v.value;
                if (value == "") {
                    return;
                }
                e.setValue(value);
            }
        }
    }

    onOkClick() {
        if (this.SelectedParentID != undefined) {
            var param: any = {};
            param.MenuChiledtId = this.selectedRow;
            param.MenuParentId = this.SelectedParentID;
            console.log(param);
            this.service.post("/ADM/Setup/Subjects/Chenge", (data) => {
                this.dataGrid.instance.refresh();
                Notify.success('تغییر اعمال شد');
                this.ChangeParentPopup = false;
            }, param);
        }
        else
            Notify.error('لطفا parentخود را انتخاب کنید');
    }

    onItemClick(e) {
        this.SelectedParentID = e.itemData.ID;
    }

    onTreeItemClick(e) {
        
        if (e.name == "ChengParent") {
            this.moveItem();
        }
        if (e.name == "SetValue") {
            
            let test = this.core.popup.open(ADMSubjectValuesPage,
                {
                    width: '900',
                    height: '650',
                    title:  e.data.Description,
                    data: { SubjectId: e.data.ID },
                }).then(res => {
                    debugger
                });
        }
    }

    onTreeItemPrepering(e) {
        if (e.name == "SetValue") {
            if (e.data.Type != 99) {
                e.visible = false;
            }
        }
    }



    onSearchChanged(e) {
        this.dataGrid.instance.searchByText(e.value);
    }

}
