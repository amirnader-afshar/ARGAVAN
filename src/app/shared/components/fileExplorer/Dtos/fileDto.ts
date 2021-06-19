
export interface IFileOutputDto {
    title: string;
    size: number;
    folderId: string;
    entityId: string;
    modifydate: string;
    filetype: string;
    categoryId: string;
    id: string;
    thumbnail: string;
    selected: boolean;
    icon: string;
    preview: string;
    code: string;
}

export class FileOutputDto implements IFileOutputDto {
    preview: string;
    icon: string;
    entityId: string;
    title: string;
    size: number;
    folderId: string;
    modifydate: string;
    filetype: string;
    categoryId: string;
    id: string;
    thumbnail: string;
    code: string;
    selected: boolean = false;

    constructor(data?: IFileOutputDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.code = data["Code"];
            this.title = data["Title"];
            this.size = data["Size"];
            this.modifydate = data["ModifyDate"];
            this.filetype = data["FileType"];
            this.folderId = data["FolderId"];
            this.categoryId = data["CategoryId"];
            this.id = data["ID"];
            this.thumbnail = data["Thumbnail"];
            this.entityId = data["EntityId"];
            this.icon = data["Icon"];
            this.preview = data["Preview"];



        }
    }

    static fromJS(data: any): FileOutputDto {
        let result = new FileOutputDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Code"] = this.code;
        data["Title"] = this.title;
        data["Size"] = this.size;
        data["ModifyDate"] = this.modifydate;
        data["FileType"] = this.filetype;
        data["FolderId"] = this.folderId;
        data["CategoryId"] = this.categoryId;
        data["ID"] = this.id;
        data["Thumbnail"] = this.thumbnail;
        data["EntityId"] = this.entityId;
        data["Icon"] = this.icon;
        data["Preview"] = this.preview;
        return data;

    }

}

export interface IListOfFileOutputDto {
    items: FileOutputDto[];
}

interface IFileDto {
    title: string;
    alt: string;
    files: FileList;
    preview: File;
    folderId: string;
    id: string;
    categoryId: string;
    fileName: string[];
    thumbnail: string;
    entityId: string;
    icon: string;
    code: string;
    fileGroup: string;
    isPublic: boolean;

}

export class FileDto implements IFileDto {
    fileGroup: string;
    icon: string;
    entityId: string;
    tabelName: string;
    thumbnail: string;
    alt: string;
    title: string;
    files: FileList;
    preview: File;
    folderId: string;
    id: string;
    categoryId: string;
    code: string;
    isPublic: boolean = false;
    fileName: string[];

    constructor(data?: IFileDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.isPublic = data["IsPublic"];
            this.fileGroup = data["FileGroup"];
            this.code = data["Code"];
            this.title = data["Title"];
            this.alt = data["Alt"];
            this.preview = data["Preview"];
            this.files = data["Files"];
            this.id = data["ID"];
            this.folderId = data["FolderId"];
            this.categoryId = data["CategoryId"];
            this.fileName = data["FileName"];
            this.thumbnail = data["Thumbnail"];
            this.entityId = data["EntityId"];
            this.icon = data["Icon"];
        }
    }

    static fromJS(data: any): FileDto {
        let result = new FileDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["IsPublic"] = this.isPublic;
        data["FileGroup"] = this.fileGroup;
        data["Code"] = this.code;
        data["Title"] = this.title;
        data["Alt"] = this.alt;
        data["Files"] = this.files;
        data["Preview"] = this.preview;
        data["ID"] = this.id;
        data["FolderId"] = this.folderId;
        data["CategoryId"] = this.categoryId;
        data["FileName"] = this.fileName;
        data["Thumbnail"] = this.thumbnail;
        data["EntityId"] = this.entityId;
        data["Icon"] = this.icon;
        return data;
    }
}

export class ListOfFileOutputDto implements IListOfFileOutputDto {
    items: FileOutputDto[];
    constructor(data?: IListOfFileOutputDto) {
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
                    this.items.push(FileOutputDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ListOfFileOutputDto {
        let result = new ListOfFileOutputDto();
        result.init(data);
        return result;
    }

    static hasEntities(data: any, entityId: string): string[] {
        let result = new ListOfFileOutputDto();
        result.init(data);
        let response = [];
        result.items.forEach(element => {
            if (element.entityId == entityId)
                response.push(element.id)
        });
        return response;
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

interface IFiles {
    selectedFiles: string[],
    allFiles: FileOutputDto[]
}
export class Files implements IFiles {
    selectedFiles: string[];
    allFiles: FileOutputDto[];

    constructor(data?: IFiles) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}