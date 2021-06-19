import { IFileOutputDto } from "./fileDto";
export class FileOutputDto implements IFileOutputDto {
    code: string;
    preview: string;
    icon: string;
    entityId: string;
    title: string;
    size: number;
    folderId: string;
    modifydate: string;
    filetype: string;
    categoryId: string;
    selected: boolean;
    id: string;
    thumbnail: string;
    flag: boolean = false;
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
            this.flag = data["Flag"];
            this.icon = data["Icon"];
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
        data["Flag"] = this.flag;
        data["Icon"] = this.icon;
        return data;
    }
}