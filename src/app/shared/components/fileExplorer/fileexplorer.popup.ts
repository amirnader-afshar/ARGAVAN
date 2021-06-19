import { PopupBasePage } from "../../BasePage";
import { DXLovComponent } from "../dx-lov.component";
import { Component, ViewChild, Output, EventEmitter, Input, OnInit, AfterViewInit } from "@angular/core";
import { DxDataGridComponent, DxValidationGroupComponent, DxTreeViewComponent } from "devextreme-angular";
import { ServiceCaller } from "../../services/ServiceCaller";
import { TranslateService } from "../../services/TranslateService";
import { ActivatedRoute } from "@angular/router";
import { PermissionService } from "../../permission";
import { DemisPopupService } from "../popup/demis-popup-service";
import { UploadPopupComponent } from "./upload.popup";
import CustomStore from 'devextreme/data/custom_store';
import { FolderExplorerService } from "./folderexplorer.service.proxy";
import { FolderDto } from './Dtos/folderDto';
import { FolderPopupComponent } from "./folder.popup";
import { FileExplorerService } from "./fileexplorer.service.proxy";
import { Files } from "./Dtos/fileDto";
import { environment } from "../../../../environments/environment";
import { FileOutputDto } from "./Dtos/FileOutputDto";
import { FileExplorerInputConfig } from "./fileexplorer.util";
import { Notify } from "../../util/Dialog";
import { Guid } from "../../types/GUID";

@Component({
    selector: 'file-explorer-popup',
    templateUrl: './fileexplorer.popup.html',
    host: { '(window:keydown)': 'hotkeys($event)' },
})

export class FileExplorerPopupPage extends PopupBasePage implements OnInit, AfterViewInit {
    ngAfterViewInit(): void {
        // this.menuItems[2].visible = false;
        // this.menuItems[3].visible = false;
    }

    @ViewChild('lov', {static: false}) lov: DXLovComponent;
    @ViewChild('file', {static: false}) file: HTMLInputElement;
    folder: FolderDto = new FolderDto();
    folderid: any = Guid.empty;
    fileIds: any = [];
    selectedKeys: any = [];
    selectedRow: any = {};
    gridSource: any = [];
    fileId: string;
    // Set Input & Output
    @Output()
    visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    _visible: boolean;
    @Input()
    get visible(): boolean {
        return this._visible;
    }
    set visible(val: boolean) {
        this._visible = val;
        this.visibleChange.emit(this._visible);
    }
    // End
    checkItem: boolean = true;
    gridMode: boolean = false;
    tileMode: boolean = true;
    detailmode: boolean = false;
    currentDetailItem: FileOutputDto;
    treeDataSource: any = {}
    foldersData: any = {}
    localData: FolderDto[] = [];

    isCheck: boolean = false;
    menuItems = [
        {
            name: "Upload",
            icon: "fa fa-folder",
            text: this.translate.instant("بارگذاری"),
            visible: true,
            items: [
                {
                    name: "FileUpload",
                    text: "بارگذاری فایل",
                    icon: "fa fa-upload",
                },
                {
                    name: "CreateFolder",
                    text: "ایجاد فولدر",
                    icon: "fa fa-cloud-upload",
                }
            ]
        },
        {
            name: "Refresh",
            icon: "fa fa-refresh blue",
            visible: true
        },
        {
            name: "Grid",
            icon: "fa fa-th-list",
            visible: true
        },
        {
            name: "Tile",
            icon: "fa fa-th-large",
            visible: true
        },
        {
            name: "Download",
            text: 'دانلود فایل',
            icon: "fa fa-download blue",
            visible: true
        },
        {
            name: "Delete",
            text: 'حذف فایل',
            icon: "fa fa-trash red",
            visible: true
        }
    ];

    @ViewChild(DxDataGridComponent, {static: false}) dataGrid: DxDataGridComponent;
    @ViewChild('form', {static: false}) form: DxValidationGroupComponent;
    @ViewChild('treeview', {static: false}) treeview: DxTreeViewComponent;

    lovParams: any = {
        Type: 1,
        Date: new Date().toISOString(),

    };

    config: FileExplorerInputConfig = new FileExplorerInputConfig();

    constructor(
        public service: ServiceCaller,
        public translate: TranslateService,
        private route: ActivatedRoute,
        public permissionService: PermissionService,
        public popup: DemisPopupService,
        private folderexplorerService: FolderExplorerService,
        private fileexplorerService: FileExplorerService
    ) {
        super(translate);
        //this.dateObject.date = new Date(1985, 9, 26);
    }
    ngOnInit() {
        
        let entityId = this.popupInstance && this.popupInstance.data ? this.popupInstance.data.entityId : null;
        if (this.popupInstance && this.popupInstance.data) {
            this.config = this.popupInstance.data;
        }
        this.LoadFolder(entityId);
        let that = this;
        if (entityId)
            that.folder.entityId = entityId;
        else if (this.folderid)
            that.folder.folderId = this.folderid;
        this.loadFile();
    }

    loadFile() {
        this.detailmode = false;
        this.folder.fileTypes = this.config.fileGroup;
        this.fileexplorerService.GetFileByFolder(this.folder).then((data: Files) => {
            if (this.isCheck == false) {
                data.selectedFiles.forEach(element => {
                    this.selectedKeys.push(element)
                    let current = data.allFiles.find(t => t.id == element);
                    if (current)
                        current.selected = true;
                });
                this.isCheck = true;
            }
            this.gridSource = data.allFiles;
            this.selectedKeys.forEach(element => {
                let current = this.gridSource.find(t => t.id == element)
                if (current)
                    current.selected = true;
            });
        });
    }

    ongridDbClick(e) {
        let url = environment.url + '/' + (e.data.preview || e.data.thumbnail)
        window.open(url);
        e.handled = true;
    }

    treeViewContentReady(event)
    {
      let item = {itemData:this.foldersData[0]}  
      this.onItemClick(item);      
    }
    LoadFolder(entityId) {
        
        let that = this;
        that.folder.entityId = entityId;
        this.treeDataSource.store = new CustomStore({
            key: "id",
            load: () => {
                return that.folderexplorerService.folderDataSource(that.folder).then(data => {
                    this.foldersData= data;
                    return data;
                    
                })
            }
        });
    }

    showDetail(data: FileOutputDto) {
        this.detailmode = true;
        this.currentDetailItem = data;
        this.fileId = data.id;
        if (this.fileId) {
            this.menuItems[2].visible = true;
            this.menuItems[3].visible = true;
        }
    }

    getImage(data) {
        return environment.url + '/' + data;
    }

    getImageStyle(item) {
        // let url = item.thumbnail || item.preview;
       //let ext = item.FileName.split('.').pop();
        return {
            'icon' : 'fa fa-file-image-o',
            //'background-color': 'red',
            'background-size': 'cover',
            'height': '75px'
        }
    }

    hotkeys(e) {
        if (e.key == "Insert") {
            this.form.instance.validate();
        }
        if (e.key == "Delete") {
        }
    }

    onChange(e) {
        let partName: string = 'file';
        let FileNames = [];
        FileNames.push(e.file);
        let formData = new FormData();
        formData.append('enctype', 'multipart/form-data')
        this.service.postFile('/EDM/File/SaveTemp', formData).then(res => {
        });
    }

    onItemClick(e) {
        
        this.folder.folderId = e.itemData.id;
        this.folderid = e.itemData.id;
        this.loadFile();
    }

    onMenuItemClick(name) {
        switch (name) {
            case "Grid":
                this.tileMode = false;
                this.gridMode = true;
                break;
            case "Tile":
                this.gridMode = false;
                this.tileMode = true;
                break;
            case "FileUpload":                
                if (this.popupInstance)
                    this.config = this.popupInstance.data;
                this.popup.open(UploadPopupComponent, {
                    title: 'بارگذاری فایل',
                    data: {
                        entityId: this.popupInstance && this.popupInstance.data ?
                            this.popupInstance.data.entityId : null,
                        folderid: this.folderid,
                        ...this.config
                    } //TODO add entity id from explorer
                }).then(res => {
                    this.loadFile();
                })
                break;
            case "CreateFolder":
                this.popup.open(FolderPopupComponent, {
                    title: 'ایجاد فولدر',
                    height: '200',
                    width: '400',
                    data: { parentFolderId: this.folderid,entityID:this.popupInstance && this.popupInstance.data ?
                        this.popupInstance.data.entityId : null
                    ,tabelName:this.popupInstance.data.tabelName }
                }).then(res => {
                    this.treeview.instance.getDataSource().reload();
                })
                break;
            case "Download":
                this.downloadFile(this.fileId);
                break;
            case "Delete":
                this.deleteFile(this.fileId);
                break;
        }
    }
    downloadFile(id) {
        debugger
        this.service.getfile("/EDM/File/Download?fileId=" + id, (data) => {

        });
    }
    deleteFile(id) {
        this.service.getPromise('/EDM/File/Delete', {id}).then(res => {
            Notify.success('فایل با موفقیت حذف شد');
            this.loadFile();

        }).catch(err => {
            Notify.error('عملیات با خطا مواجه شد')
        });
    }

    onDataChange(item) {
        this.isCheck = true;
        item.selected = !item.selected;
        let searchedIndex = this.selectedKeys.indexOf(this.selectedKeys.filter(c => c == item.id)[0])
        if (searchedIndex == -1)
            this.selectedKeys.push(item.id)
        else
            this.selectedKeys.splice(searchedIndex, 1)

    }

    closeExplorer() {
        this.popupInstance.close();
    }

    submitExplorer() {
        
        let result = [];
        this.gridSource.forEach(element => {
            let searchedIndex = this.selectedKeys.indexOf(this.selectedKeys.filter(c => c == element.id)[0])
            if (searchedIndex != -1)
                result.push(element);
        });
        if (result.length <= 0 && this.config.MultiSelect == false) {
            result = [];
            result.push(this.currentDetailItem);
        }
        this.popupInstance.result(result);
        this.popupInstance.close();
    }

    expandItem(ev) {
        
    }
}
