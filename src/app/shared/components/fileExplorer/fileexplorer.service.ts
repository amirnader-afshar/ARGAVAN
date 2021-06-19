import { Injectable } from '@angular/core';
import { DemisPopupService } from '../popup/demis-popup-service';
import { FileExplorerPopupPage } from './fileexplorer.popup';
import { checkInput, FileExplorerInputConfig } from './fileexplorer.util';

@Injectable()
export class FileExplorerManager {
    constructor(private popup: DemisPopupService) {

    }

    open(data: FileExplorerInputConfig): Promise<any> {
        return this.popup.open(FileExplorerPopupPage, {
            width: '60%',
            height: '70%',
            title: 'مدیریت فایل ها',
            data: checkInput(data)
        })
    }
}
