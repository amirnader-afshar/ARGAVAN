import { Injectable } from '@angular/core';
import { CoreService } from '../../services/CoreService';
import { List } from 'immutable';
import { FileDto, ListOfFileOutputDto, Files } from './Dtos/fileDto';
import { Notify } from '../../util/Dialog';
import { FolderDto } from './Dtos/folderDto';
import { ServiceCaller } from '../../services/ServiceCaller';
import { TranslateService } from '../../services/TranslateService';

@Injectable()
export class FileExplorerService {

    constructor(private http: ServiceCaller, private translate: TranslateService) {
    }

    getAllFiles(): List<FileDto> {
        return null;
    }

    /**
     * upload file
     * @param files file list
     */
    uploadFile(model: FileDto): Promise<void> {
        
        let formData = new FormData();
        formData.append('enctype', 'multipart/form-data')
        if (model.files)
        {
            for (let i = 0; i < model.files.length; i++) {
                const element = model.files.item(i);
                formData.append('files', element, element.name);
            }
        }
        for (let i = 0; i < model.scanedFiles.length; i++) {
            const element = model.scanedFiles[i];
            formData.append('files', element, element.name);
        }        
        if (model.preview && model.preview[0])
            formData.append('preview', model.preview[0], model.preview[0].name);

        for (var property in model) {
            if (model.hasOwnProperty(property) && property !== 'files' && property !== 'preview')
                formData.append(property, (<any>model)[property])
        }
        
        return this.http.postFile('/EDM/File/UploadFile', formData).then(response => {
            //TODO: sm-edit check status code
            return response;
        }).catch(err => {
            Notify.error(this.translate.instant(err));
        });
    }

    GetFileByFolder(folder: FolderDto): Promise<any> {
        return this.http.getPromise('/EDM/File/GetFileByFolder', folder.toJSON()).then(response => {
            return new Files({
                allFiles: ListOfFileOutputDto.fromJS(response).items,
                selectedFiles: ListOfFileOutputDto.hasEntities(response, folder.entityId)
            });
        }).catch(err => {
            Notify.error(this.translate.instant(err));
        });
    }
}