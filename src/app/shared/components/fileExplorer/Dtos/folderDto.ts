import { FileGroup } from "../fileexplorer.util";

interface IFolderDto {
    id: string;
    parentFolderId: string;
    folderId: string;
    entityId?: string;
    name: string;
    description: string;
    path: string;
    fileTypes: FileGroup
}
export class FolderDto implements IFolderDto {
    folderId: string;
    entityId?: string = null;
    tabelName?:string=null;
    id: string;
    parentFolderId: string;
    name: string;
    description: string;
    path: string;
    fileTypes: FileGroup;
    //selected:boolean=true;
    constructor(data?: IFolderDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["ID"];
            this.folderId = data["FolderId"];
            this.entityId = data["EntityId"];
            this.parentFolderId = data["ParentFolderId"];
            this.name = data["Name"];
            this.description = data["Description"];
            this.path = data["Path"];
        }
    }
    static fromJS(data: any): FolderDto {
        let result = new FolderDto();
        result.init(data);
        return result;
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["ID"] = this.id;
        data["FolderId"] = this.folderId;
        data["EntityId"] = this.entityId;
        data["ParentFolderId"] = this.parentFolderId;
        data["Name"] = this.name;
        data["Description"] = this.description;
        data["Path"] = this.path;
        data["Group"]= this.fileTypes;
        return data;
    }
}


export class ListOfFolderDto implements IListOfFolderDto {
    items: FolderDto[];
    constructor(data?: IListOfFolderDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            if (data.constructor === Array) {
                this.items = [];
                for (let item of data)
                    this.items.push(FolderDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ListOfFolderDto {
        let result = new ListOfFolderDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (this.items && this.items.constructor === Array) {
            data = [];
            for (let item of this.items)
                data.push(item.toJSON());
        }
        return data;
    }
}

export interface IListOfFolderDto {
    items: FolderDto[];
}

// export class InputOfFolderDto implements IInputOfFolderDto{}

// interface IInputOfFolderDto{

// }
// export class OutpuOfFolderDto implements IOutputOfFolderDto{}

// interface IOutputOfFolderDto{

// }