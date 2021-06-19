import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxTreeViewComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import { ConfigType } from '../shared/types/ConfigType';
import { ConfigService } from '../../shared/services/ConfigService';

@Component({

    templateUrl: './configs.page.html',
    providers: [ServiceCaller]
})
export class ADMConfigsPage extends BasePage {
    @ViewChild('treeview',{static: false}) treeview: DxTreeViewComponent;

    groupDataSource: any = [];
    treeDataSource: any = {};
    localData: any[] = [];
    filter: any = {};
    SelectedSubjectId: any = {};
    configmode: ConfigType;
    subjectCode: any = {};
    selectedKey: any = {};
    searchValue: string = '';

    menuItems: any[] = [
        {
            name: "Save",
            text: this.translate.instant("PUB_SAVE"),
            icon: "fa fa-floppy-o green",
            visible: true
        },
        {
            name: "Refresh",
            icon: "fa fa-refresh blue",
            text: this.translate.instant("PUB_REFRESH"),
            visible: true
        },
    ]

    SubjectFilter: any = {
        ParentSubjectId: null
    }

    constructor(
        public serviceCaller: ServiceCaller,
        public translate: TranslateService,
        private route: ActivatedRoute,
        private config: ConfigService) {
        super(translate);
        this.service = serviceCaller;
        
        this.configmode = this.route.snapshot.data["mode"];
        this.subjectCode = this.route.snapshot.data["subject"];
        if (this.route.snapshot.queryParams['subject']) {
            this.subjectCode = this.route.snapshot.queryParams["subject"];
        }
        if (this.route.snapshot.queryParams['key']) {
            this.selectedKey = this.route.snapshot.queryParams["key"];
        }

        this.configDataSource();
    }

    onMenuItemClick(name) {
        switch (name) {
            case "Save":
                this.onSubmitClick();
                break;
            case "Refresh":
                this.treeview.instance.getDataSource().reload();
                break;
        }
    }

    configDataSource() {
        this.treeDataSource.store = new CustomStore({
            key: "ID",
            load: () => {
                var param: any = {};
                param.configmode = this.configmode;
                param.SubjectCode = this.subjectCode;
                param.Key = this.selectedKey;
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.get("/ADM/Config/GetAll", (data) => {
                    this.localData = data;
                    let treeItems = [];
                    for (let i = 0; i < this.localData.length; i++) {
                        if (!treeItems.some(s => s.SubjectId == this.localData[i].SubjectId)) {
                            treeItems.push(this.localData[i]);
                        }
                    }
                    deferred.resolve(treeItems);
                    setTimeout(() => {
                        let selected = this.localData[0];
                        this.onItemClick({ itemData: selected });
                        //this.treeview.instance.selectItem(selected);
                    }, 50);

                }, param)
                return deferred.promise;
            }
        });
    }

    onSubmitClick() {
        let params: any = {};
        params.ConfigMode = this.configmode;
        params.Items = this.localData.filter(c => c.Changed == true).map((i) => {
            return {
                Key: i.Key,
                Value: i.Value
            };
        });
        this.service.postPromise("/ADM/Config/Save", params).then(() => {
            this.config.reload();
            Notify.success('اطلاعات با موفقیت ذخیره شد');
        });
    }

    changeItem(group, item) {
        this.groupDataSource.forEach(element => {
            if (element.Group == group) {
                if (!element.items)
                    element.items = [];
                element.items.push(item);
            }
        });
    }

    onItemClick(e) {
        if (e.itemData != null) {
            this.SelectedSubjectId = e.itemData.SubjectId;
            var result = this.localData.filter(f => f.SubjectId == e.itemData.SubjectId);
            this.groupDataSource = [];

            result.forEach(element => {
                let temp = this.groupDataSource.find(e => e.Group == element.Group)
                if (!temp) {
                    this.groupDataSource.push({
                        Group: element.Group
                    });
                }
                this.changeItem(element.Group, {
                    Key: element.Key,
                    Title: element.Title,
                    Value: element.Value,
                    Type: element.DataType,
                    LovName: element.LovName,
                    SubjectId: element.SubjectId
                })
            });
        }
    }

    textValueChange(e, item) {
        this.updateValue(item, e.value);
    }

    numberValueChange(e, item) {
        this.updateValue(item, Number(e.value));
    }

    dateValueChange(e, item) {
        this.updateValue(item, e.value);
    }

    lovValueChange(e, item) {
        this.updateValue(item, e);
    }

    checkChange(e, item) {
        this.updateValue(item, e.value == true ? 1 : 0);
    }

    updateValue(item, value) {
        let i = this.localData.find(c => c.Key == item.Key);
        if (item.Value != value) {
            i.Value = value;
            i.Changed = true;
        }
    }



}
