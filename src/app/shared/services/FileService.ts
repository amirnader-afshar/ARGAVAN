import { Injectable } from '@angular/core';


@Injectable()
export class FileService {

    private static fileInfo = {
        files: [],
        entityId: ''
    }

    private static ClearUppyCallback: any = null;

    private Files = [];

    private isPending = false;

    public getFileInfo() {
        return FileService.fileInfo;
    }

    public setClearUppy(cb, ctx) {
        FileService.ClearUppyCallback = ctx;
    }

    public setFileInfo(fileNames, tableName, entityId = null, preFileName = null) {
        if (fileNames != null && entityId == null) {
            FileService.fileInfo.files.push({
                TableName: tableName,
                FileNames: fileNames,
                entityId: entityId,
                preFileName: preFileName
            })

        }
        FileService.fileInfo.files.forEach(element => {
            if (entityId != null && fileNames == null && element.TableName == tableName) {
                element.entityId = entityId;
            }
        });
        // FileService.fileInfo = {
        //     ...FileService.fileInfo,
        //     TableName: tableName,
        //     FileNames: fileNames
        // }
    }

    public setRawFileInfo(files) {
        this.Files = files;
    }

    public getRawFileInfo() {
        return this.Files;
    }

    public getStatusPending() {
        return this.isPending;
    }

    public setPending(value = false) {
        this.isPending = value;
    }

    public clearFileInfo() {
        FileService.fileInfo.files = [{
            FileNames: [],
            TableName: '',
            entityId: '',
            preFileName: ''
        }]
        FileService.fileInfo.entityId = ''
        this.Files = [];
        if (FileService.ClearUppyCallback) {
            FileService.ClearUppyCallback.reset();
        }
    }

    public removeFileByName(name: string) {
        let arr = [];
        this.getFileInfo().files.forEach(element => {
            element.FileNames.forEach(item => {
                arr.push(item);
            });
        });
        Array.isArray(arr)
            ? arr.filter(c => c.Alias === name).reduce((acc, val) => {
                arr.splice(arr.indexOf(val), 1);
                return acc.concat(val);
            }, [])
            : [];

        this.getFileInfo().files = arr;
    }
}