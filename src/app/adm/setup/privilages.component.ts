import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { DxTreeListComponent } from 'devextreme-angular';
import { EventsService } from 'angular-event-service/dist';
import { BasePage } from '../../shared/BasePage';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { TranslateService } from '../../shared/services/TranslateService';
import { Deferred } from '../../shared/Deferred';
import { Notify, Dialog } from '../../shared/util/Dialog';


@Component({
    selector: 'adm-privileges',
    templateUrl: './privilages.component.html'
})
export class ADMPrivilegeComponent extends BasePage {


    public dataSource: any = {};
    @ViewChild('treeview',{static: false}) treeview: DxTreeListComponent;

    private localData: any[] = [];
    private changes: any[] = [];

    searchValue: string = '';



    @Output()
    itemIdChange: EventEmitter<string> = new EventEmitter<string>();

    private _itemId: string;
    @Input()
    get itemId(): string {
        return this._itemId;
    }

    set itemId(val: string) {
        if (this._itemId != val) {
            this._itemId = val;
            setTimeout(() => {
                this.loadData();
            }, 100);
            this.itemIdChange.emit(this._itemId);
        }
    }

    @Input()
    height: string = "450";

    @Input()
    level: string;

    privilagesType: any[] = [
        {
            Value: 0,
            Title: "براساس سطح بالاتر"
        },
        {
            Value: 1,
            Title: "دارد"
        },
        {
            Value: 2,
            Title: "ندارد"
        }
    ];

    constructor(
        public service: ServiceCaller,
        public translate: TranslateService,
        public eventsService: EventsService
    ) {
        super(translate);

        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred = new Deferred();
                deferred.resolve(this.localData);
                return deferred.promise;
            },
            update: (key, values) => {
                let deferred = new Deferred();
                this.setChecked(key, values.InheritedState).then(c => {

                    deferred.resolve(true);
                });
                return deferred;
            }
        });
    }


    private loadData() {

        var param: any = {};
        if (this.level == "user")
            param.UserId = this.itemId;
        else if (this.level == "company")
            param.CompanyId = this.itemId;
        else
            param.GroupId = this.itemId;
        //
        
        this.service.get("/ADM/Security/Privilege/List", (data) => {
            this.localData = data;
            this.treeview.instance.refresh();
        }, param);
    }

    private setChecked(key, value: boolean, applyForSubs: boolean = null): Promise<void> {

        return new Promise((resolve, reject) => {
            let item = this.localData.find(c => c.ID == key);
            item.InheritedState = value;
            let exists = this.changes.find(c => c.ID == key)
            if (exists) {
                exists.State = value;
            }
            else {
                this.changes.push({ ID: item.ID, State: value });
            }
            let items = this.localData.filter(c => c.ParentID == key);
            if (items.length) {
                if (applyForSubs) {
                    items.forEach(i => {
                        this.setChecked(i.ID, value, true);
                    });
                    resolve();
                }
                else {
                    Dialog.confirm("PUB_CONFIRM", "این تغییر برای زیر مجوعه ها اجرا شود؟").okay(() => {
                        items.forEach(i => {
                            this.setChecked(i.ID, value, true);
                        });
                    }).final(() => {
                        resolve();
                    });
                }
            }
            else {
                resolve();
            }

        });
    }

    saveChanges(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.itemId != null) {
                var param: any = {};
                if (this.level == "user")
                    param.UserId = this.itemId;
                else if (this.level == "company")
                    param.CompanyId = this.itemId;
                else
                    param.GroupId = this.itemId;
                //
                param.States = this.changes;
                this.service.post("/ADM/Security/Privilege/Save", (data) => {
                    Notify.success();
                    this.changes = [];
                    this.loadData();
                    resolve();
                }, param).catch(reason => {
                    reject(reason);
                });
            }
            else {
                reject();
            }
        });
    }

    reload() {
        this.loadData();
    }



    private findTitle(state, value) {
        return this.privilagesType.find(c => c.Value == state).Title;
    }

    private findColor(state, value) {
        if (state == 0) {
            return value ? 'green' : 'red';
        }
        return state == 1 ? 'green' : 'red';
    }

    private findIcon(state, value) {
        if (state == 0) {
            return value ? 'fa-check' : 'fa-ban';
        }
        return state == 1 ? 'fa-check' : 'fa-ban';
    }
}