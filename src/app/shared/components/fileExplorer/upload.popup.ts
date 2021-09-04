import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileDto } from './Dtos/fileDto';
import { FileExplorerService } from './fileexplorer.service.proxy';
import { PopupBasePage } from '../../BasePage';
import { CoreService } from '../../services/CoreService';
import { FileExplorerInputConfig, applyConfigDefaults, UploadMode, fileExtensionConvertor } from './fileexplorer.util';
import { Notify } from '../../util/Dialog';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { TranslateService } from '../../services/TranslateService';

@Component({
    templateUrl: 'upload.popup.html'
})

export class UploadPopupComponent extends PopupBasePage implements OnInit {

    @ViewChild('mainfile') mainfile: ElementRef;
    @ViewChild('form') form: DxValidationGroupComponent;

    file: FileDto = new FileDto();
    useMultipleUpload: boolean = false;
    saveInfoForAll: boolean = false;
    config: FileExplorerInputConfig;
    constructor(private explorerService: FileExplorerService, public translate: TranslateService) {
        super(translate);
    }

    ngOnInit() {
        this.file.folderId = this.popupInstance.data.folderid;
        this.config = applyConfigDefaults(this.popupInstance.data);
        this.useMultipleUpload = this.config.uploadMode === UploadMode.Multiple;

        // this.mainfile.nativeElement.onchange = function () {
        //     if (this.files[0].size > that.config.fileSize * 1000000) {
        //  let that = this;
        //        this.value = "";
        //         Notify.error('حجم فایل انتخاب شده بزرگتر از حد مجاز است');
        //     };
        // };
    }

    onChangeMain(e) {
        this.file.files = e.target.files;
    }

    onChangePreveiw(e) {
        this.file.preview = e.target.files;
    }

    upload(): void {
        
        let that = this;
        var result = this.form.instance.validate();
        if (result.isValid) {
            this.file.fileGroup = this.config.fileGroup.toString();
            this.file.entityId = this.config.entityId;
            this.file.tabelName = this.config.tabelName;
            this.explorerService.uploadFile(this.file).then(res => {
                if (res!=null){
                    this.popupInstance.result(res);
                    this.popupInstance.close();
                }
                    
            });
        }
    }

    close(): void {
        this.popupInstance.close();
    }

    fileExtensions(): string {
        let extensions = '';
        this.config.fileExtensions.forEach((item, index) => {
            extensions += fileExtensionConvertor(item) + ',';
        })
        if (extensions.endsWith(','))
            extensions.substr(extensions.length - 1);
        return extensions;
    }

    checkPreview() {
        return !this.config.previewAndMainAreSame;
    }

    saveForAll() {
        if (!this.useMultipleUpload) return true;
        if (this.useMultipleUpload && this.saveInfoForAll)
            return true;
        return false;
        // return (this.useMultipleUpload || (!this.useMultipleUpload && this.saveInfoForAll))
    }
}