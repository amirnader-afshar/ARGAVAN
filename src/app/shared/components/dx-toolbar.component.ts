import { Component, Input, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';

import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../services/TranslateService';
import { DxMenuComponent } from 'devextreme-angular';
import { RouteData } from '../util/RouteData';
import { PrintComponent } from './print.component';
import { browser } from 'protractor';
import { Router, ActivatedRoute } from '@angular/router';
import { DemisPopupService } from './popup/demis-popup-service';
import { FileExplorerManager } from './fileExplorer/fileexplorer.service';
import { FileExplorerInputConfig } from './fileExplorer/fileexplorer.util';

declare var jQuery: any;

@Component({
    selector: 'page-toolbar',
    templateUrl: './dx-toolbar.component.html'
})
export class DXToolbarComponent {

    infoItems: any[] = [
        {
            name: "info",
            icon: "fa fa-info-circle green fa-2x",
            visible: false,
        },
        {
            name: "help",
            icon: "fa fa-question red fa-2x",
            visible: false
        },
        {
            name: "print",
            icon: "fa fa-print blue fa-2x",
            formCode: "formCode",
            params: "params",
            visible: false
        },
        {
            name: "workflow",
            icon: "fa fa-gear yellow fa-2x",
            visible: false
        },
        {
            name: "fileupload",
            icon: "fa fa-upload blue fa-2x",
            visible: false
        },

    ];

    @ViewChild('menu', { static: true }) menu: DxMenuComponent;
    @ViewChild('info', { static: true }) info: DxMenuComponent;


    private _wid: string = "";
    private _pid: string = "";

    ngAfterViewInit() {

    }

    @Output() formCodeChange: EventEmitter<string> = new EventEmitter<string>();
    private _formCode: string;
    // form code
    @Input()
    get formCode(): string {
        return this._formCode;
    }
    set formCode(val: string) {
        this._formCode = val;
        this.formCodeChange.emit(val);
        this.infoItems[2].visible = val != null;
        this.updateMenu();
    }
    //fileUpload
    @Output() fileContainerChange: EventEmitter<any> = new EventEmitter<any>();
    private _fileIds: any;
    @Input()
    get fileContainer(): any {
        return this._fileIds;
    }
    set fileContainer(val: any) {
        this._fileIds = val;
        this.fileContainerChange.emit(this._fileIds);
        this.infoItems[4].visible = true;
    }

    @Input() entityId: string = null;
    //params

    @Input() fileConfig: FileExplorerInputConfig = new FileExplorerInputConfig();

    @Output() paramsChange: EventEmitter<any>;

    private _params: any = {};

    @Input()
    get params(): any {
        return this._params;
    }
    set params(val: any) {
        this._params = val;
        if (val)
            this.paramsChange.emit(this._params);
    }
    //  Help button
    @Input()
    helpUrl: string = null;

    private _showHelp: boolean = false;
    @Input()
    get showHelp(): boolean {
        return this._showHelp;
    }
    set showHelp(val: boolean) {
        this._showHelp = val;
        this.infoItems[1].visible = val;
    }

    // Items
    private _items: any[] = [];

    @Input()
    get items(): any[] {
        return this._items;
    }

    set items(val: any[]) {
        this._items = val;
    }


    @Output() onItemClick: EventEmitter<any>;

    onMenuItemClick(data) {
        let item = data.itemData;
        let name = item.name;
        this.onItemClick.emit(name);
    }

    onInfoItemsMenuItemClick(data) {
        let item = data.itemData;
        let name = item.name;
        let params = this.params;
        if (name == "print" && this.formCode) {
            this.print.init(params, this.formCode);
            this.print.printwithoutshow();
        }
        if (name == "fileupload") {
            this.fileExplorer.open({ entityId: this.entityId, ...this.fileConfig })
                .then(res => {
                    return res;
                })
        }
        if (name == 'help') {
            this.onItemClick.emit(name);
        }
    }

    constructor(
        public print: PrintComponent,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private popup: DemisPopupService,
        private fileExplorer: FileExplorerManager
    ) {
        let that = this;
        that.onItemClick = new EventEmitter<any>();
        that.paramsChange = new EventEmitter<any>();
        that.route.queryParams.subscribe(params => {
            if (params["WID"] != null) {
                that._wid = params["WID"];
            }
        });
    }

    updateMenu() {
        if (this.menu.instance) {
            this.menu.instance.option("items", this.items);
        }
        if (this.info.instance) {
            this.info.instance.option("items", this.infoItems);
        }
    }

}

