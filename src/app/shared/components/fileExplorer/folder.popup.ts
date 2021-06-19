import { Component, OnInit, AfterViewInit } from '@angular/core';
import {  PopupBasePage } from '../../BasePage';
import { FolderDto } from './Dtos/folderDto';
import { FolderExplorerService } from './folderexplorer.service.proxy';
import { TranslateService } from '../../services/TranslateService';

@Component({
    templateUrl: 'folder.popup.html'
})

export class FolderPopupComponent extends PopupBasePage implements OnInit {
    folder: FolderDto = new FolderDto();
    multiple: boolean = false;
    constructor(private explorerService: FolderExplorerService,public translate: TranslateService) {
        super(translate);
    }

    ngOnInit() {
        this.folder.parentFolderId = this.popupInstance.data.parentFolderId;
        this.folder.entityId = this.popupInstance.data.entityId;
        this.folder.tabelName = this.popupInstance.data.tabelName;
    }

    closeFolder(): void {
        this.popupInstance.close();
    }

    CreateFolder() {
        let that = this;
        that.explorerService.createFolder(that.folder).then(res => {
            if (res) {
                this.popupInstance.result(res);
                this.popupInstance.close();
            }
        });
    }
}