import { PopupBasePage } from "../../shared/BasePage";
import { Component, ViewChild, OnInit } from "@angular/core";
import { TranslateService } from "../../shared/services/TranslateService";
import { DxDataGridComponent } from "devextreme-angular";
import { ServiceCaller } from "../../shared/services/ServiceCaller";
import CustomStore from "devextreme/data/custom_store";
import { Deferred } from "../../shared/Deferred";
import { CoreService } from "../../shared/services/CoreService";

@Component({
    templateUrl: './subject-values.popup.html',
})
export class ADMSubjectValuesPage extends PopupBasePage implements OnInit {

    ngOnInit(){
        this.searchItem.SubjectId = this.popupInstance.data.SubjectId
    }
    
    @ViewChild("grid",{static: false}) grid: DxDataGridComponent;
    localData: any[] = [];
    private changes: any[] = [];


    searchItem: any = {};
    lovFilter: any = {};
    dataSource: any = {};

    privilagesType: any[] = [
        {
            Value: 1,
            Title: "دارد"
        },
        {
            Value: 0,
            Title: "ندارد"
        }
    ];

    constructor(public core: CoreService) {
        super(core.translate);

        this.dataSource.store = new CustomStore({
            load: loadOptions => {
                let result = new Deferred();
                result.resolve(this.localData);
                return result.promise
            },
            update: (key, values) => {
                let deferred = new Deferred();
                
                let item = this.localData.find(c => c.ID == key.ID);
                item.Allowed = values.Allowed;
                let exists = this.changes.find(c => c.ID == key.ID)
                if (exists) {
                    exists.Allowed = values.Allowed;
                }
                else {
                    this.changes.push({ ID: item.ID, Allowed: values.Allowed });
                }
                deferred.resolve();
                return deferred;
            }
        });
    }

    onSchemaDataChange(e) {
        this.lovFilter.Schema = e.Name;
    }

    onTableDataChange(e) {
        if (!this.searchItem || !this.searchItem.TableId || !this.searchItem.SubjectId)
            return;
        this.core.http.getPromise("/ADM/Setup/Subjects/Values", this.searchItem).then((data) => {
            this.grid.instance.getVisibleColumns().forEach(c => {
                if (c.dataField == "Allowed")
                    return;
                this.grid.instance.deleteColumn(c.dataField);
            });
            if (data.Data) {
                data.Fields.forEach(f => {
                    if (f.Name == "ID" || f.Name == "Allowed")
                        return;
                    var col = {
                        dataField: f.Name,
                        caption: f.Title ? f.Title : f.Name,
                        allowEditing: false,
                    };
                    this.grid.instance.addColumn(col);
                });
            }
            this.localData = data.Data;
            this.grid.instance.refresh();
        });
    }


    onApplyClick() {
        let data = {
            SubjectId: this.searchItem.SubjectId,
            TableId: this.searchItem.TableId,
            Changes: []
        };
        data.Changes = this.changes;
        this.core.http.postPromise("/ADM/Setup/Subjects/Values/Save", data).then((data) => {
            this.popupInstance.close();
        });

    }

    onCloseClick() {
        this.popupInstance.close();
    }

    private findTitle(value) {
        return this.privilagesType.find(c => c.Value == value).Title;
    }

    private findColor(value) {

        return value == 1 ? 'green' : 'red';
    }

    private findIcon(value) {
        return value == 1 ? 'fa-check' : 'fa-ban';
    }
}