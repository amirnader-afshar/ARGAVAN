
export enum FileGroup {
    Signature,
    OfficeTemplate,
    Avatar,
    Document,
    System,
    ForEntity,
    SharedWithMe,
    ofaMainFile,
    ofaAttachments,
    msgAttachments
}

export enum FileExtension {
    Image,
    Video,
    Audio,
    All,
    Word,
    Pdf,
    Excel,
    Xml
}

export enum UploadMode {
    Single,
    Multiple
}

class FileGroupDefaults {
    fileGroup: FileGroup;
    title: string
    /**
     *
     */
    constructor(title: string, fileGroup: FileGroup) {
        this.title = title, this.fileGroup = fileGroup;
    }
}
export function fileGroupDefaults(): FileGroupDefaults[] {
    let result = [];
    result.push(new FileGroupDefaults('امضاء', FileGroup.Signature));
    result.push(new FileGroupDefaults('پروفایل', FileGroup.Avatar));
    result.push(new FileGroupDefaults('فایل های مشترک', FileGroup.System));
    result.push(new FileGroupDefaults('فایل های عمومی', FileGroup.SharedWithMe));
    return result;
}

export function checkInput(data: FileExplorerInputConfig): FileExplorerInputConfig {
    let config = applyConfigDefaults(data, new FileExplorerInputConfig())
    return fileGroupManager(config);
}

export function fileGroupManager(data: FileExplorerInputConfig) {
    switch (data.fileGroup) {
        case FileGroup.Signature:
            return applyConfigDefaults({
                fileGroup: data.fileGroup,
                fileExtensions: [FileExtension.Image],
                ...data
            })
        case FileGroup.Document:
            return applyConfigDefaults({
                fileGroup: data.fileGroup,
                fileExtensions: [FileExtension.All],
                ...data
            })
        case FileGroup.OfficeTemplate:
            return applyConfigDefaults({
                fileGroup: data.fileGroup,
                fileExtensions: [FileExtension.Word, FileExtension.Excel],
                ...data
            })
        case FileGroup.Avatar:
            return applyConfigDefaults({
                fileGroup: data.fileGroup,
                fileExtensions: [FileExtension.Image],
                ...data
            })
         case FileGroup.ofaMainFile:
            return applyConfigDefaults({
                fileGroup: data.fileGroup,
                fileExtensions: [FileExtension.Pdf],
                ...data
            })
        case FileGroup.ofaAttachments:
                return applyConfigDefaults({
                    fileGroup: data.fileGroup,
                    fileExtensions: [FileExtension.All],
                    ...data
                })        
        case FileGroup.msgAttachments:
            return applyConfigDefaults({
                fileGroup: data.fileGroup,
                fileExtensions: [FileExtension.All],
                ...data
            })                        
        default:
            break;
    }
}

export function fileExtensionConvertor(extension: FileExtension) {
    switch (extension) {
        case FileExtension.All:
            return '*';
        case FileExtension.Image:
            return 'image/*';
        case FileExtension.Video:
            return 'video/*';
        case FileExtension.Audio:
            return 'audio/*';
        case FileExtension.Word:
            return '.doc,.docx, .txt';
        case FileExtension.Xml:
            return '.xml';
        case FileExtension.Excel:
            return '.xls, .xlsx';
        case FileExtension.Pdf:
            return '.pdf';

        default:
            break;
    }
}

export function applyConfigDefaults(
    config?: FileExplorerInputConfig, defaultConfig?: FileExplorerInputConfig): FileExplorerInputConfig {
    return { ...defaultConfig, ...config };
}

interface IFileExplorerInputConfig {
    /**
     * Entity Id
     */
    entityId?: string,
    /**
     * پسوند فایل های انتخابی
     */
    fileExtensions?: FileExtension[];
    /**
     * انتخاب گروه فایل، به عنوان مثال: امضا، عکس پروفایل و غیره
     */
    fileGroup?: FileGroup;
    /**
     * اندازه فایل MB
     */
    fileSize?: number;
    /**
     * فعال/غیرفعال کردن حالت انتخاب چند فایل به صورت همزمان
     */
    multipleModeDisable?: boolean;
    /**
     * تعریف نوع آپلود به صورت تک فایل یا چند فایل
     */
    uploadMode?: UploadMode;
    /**
     * با استفاده از این قابلیت میتوان گرفتن پیش نمایش را در هنگام آپلود فعال و یا غیر فعال نمود
     */
    previewAndMainAreSame?: boolean;
    /**
     * فعال و یا غیر فعال نمودن کنترل آبشاری سطح امنیتی فایل به صورت محرمانه و غیر محرمانه
     */
    enableSecurityMode?: boolean;

    /**
     * برای ایجاد فایل های عمومی از این فلگ استفاده می شود
     */
    isPublic?: boolean;
    /**
     * شماره فایل
     */
    Code?: string;

    /**
     * چند انتخابی
     */
    MultiSelect?: boolean
}

export class FileExplorerInputConfig implements IFileExplorerInputConfig {
    entityId?: string = null;
    tabelName?: string = null;
    fileExtensions?: FileExtension[] = [FileExtension.All];
    fileGroup?: FileGroup = FileGroup.Document;
    fileSize?: number = 2;
    multipleModeDisable?: boolean = false;
    uploadMode?: UploadMode = UploadMode.Single;
    previewAndMainAreSame?: boolean = false;
    enableSecurityMode?: boolean = true;
    isPublic?: boolean = false;
    Code?: string = null;
    MultiSelect?: boolean = true;
}