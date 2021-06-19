import { Injectable } from '@angular/core';
import { FolderDto, ListOfFolderDto } from './Dtos/folderDto';
import { Notify } from '../../util/Dialog';
import { ServiceCaller } from '../../services/ServiceCaller';
import { TranslateService } from '../../services/TranslateService';
import { FileGroup, fileGroupDefaults } from './fileexplorer.util';

@Injectable()
export class FolderExplorerService {
    constructor(private http: ServiceCaller, private translate: TranslateService) {
    }

    folderDataSource(model: FolderDto): Promise<any> {
        return this.http.getPromise('/EDM/Folder/List', model.toJSON()).then(response => {
            let result = ListOfFolderDto.fromJS(response).items;
            // if (model.entityId)
            //     result.unshift(new FolderDto({
            //         id: null,
            //         parentFolderId: null,
            //         folderId: null,
            //         entityId: model.entityId,
            //         name: 'فایل های مربوطه',
            //         description: null,
            //         path: null,
            //         fileTypes: FileGroup.ForEntity
            //     }))
            // fileGroupDefaults().forEach(fileGroup => {
            //     result.unshift(new FolderDto({
            //         id: null,
            //         parentFolderId: null,
            //         folderId: null,
            //         name: fileGroup.title,
            //         description: null,
            //         path: null,
            //         fileTypes: fileGroup.fileGroup
            //     }))
            // });
            return result;
        }).catch(err => {
            Notify.error(this.translate.instant(err));
        });

    }

    createFolder(model: FolderDto): Promise<any> {
        return this.http.postPromise('/EDM/Folder/Save', model.toJSON()).then(response => {
            return response;
        }).catch(err => {
            Notify.error(this.translate.instant(err));
        });
    }
}