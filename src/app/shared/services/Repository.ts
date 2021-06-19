import notify from 'devextreme/ui/notify';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventsService } from 'angular-event-service/dist';
import { ReflectiveInjector } from '@angular/core';
import { FileService } from './FileService';
import { HttpClientHandler } from '../errorHandler/http-error.tldr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare function $params(obj: any): string;

export class Repository {
    busyStack: Array<boolean> = new Array<boolean>();

    // private fileInfo = {
    //     FileNames: [],
    //     TableName: '',
    //     entityId: ''
    // }

    getSubject: Function;

    public BaseURL: string = environment.api_url;
    public BaseFileURL: string = environment.file_url;
    public SunRsv_PicsURL: string = '';

    protected defaultConfig: any = { loading: true };



    protected fileService: FileService;

    constructor(protected http: HttpClient, protected eventsService: EventsService,
        public httpHandler: HttpClientHandler) {
        const injector = ReflectiveInjector.resolveAndCreate([
            FileService
        ]);
        localStorage.setItem("SunRsv_PicsURL", this.SunRsv_PicsURL);
        this.fileService = injector.get(FileService);
    }

    protected showNotify(message: string) {
        notify({
            message: message,
            type: 'error',
            width: 400,
            displayTime: 10000,
            closeOnClick: true,
            closeOnOutsideClick: true
        });
    }

    protected showLoading() {
        this.busyStack.push(true);
        this.eventsService.broadcast('loading', this.isBusy());
    }

    protected hideLoading() {
        this.busyStack.pop();
        this.eventsService.broadcast('loading', this.isBusy());
    }

    private isBusy() {
        return this.busyStack.length > 0;
    }

    /**
     * return Promise<any>
     * @param path
     * @param params
     */
    public getPromise(path, params: any = null, config: any = this.defaultConfig): Promise<any> {

        const headers = this.createHeader();

        return new Promise((resolve, reject) => {

            let url = this.BaseURL + path;
            const q = $params(params);

            if (q != '') {
                if (url.indexOf('?') > 0) {
                    url = url + '&' + q;
                }
                else {
                    url = url + '?' + q;
                }
            }

            // console.log('get=> ' + url);
            // 
            //
            if (config.loading) {
                this.showLoading();
            }
            this.http.get(url, { headers: headers })
                .toPromise()
                .then(response => {
                    if (response['Succeed'] === true) {
                        resolve(response['Result']);
                    }
                    else {
                        const message = response['Message']['Handled'] == true ? response['Message']['Text'] : 'Network Error';
                        //Notify.error(message);
                        this.httpHandler.handleError(message, this.showNotify);
                        reject(message);

                    }
                }).catch(err => {
                    reject(err.message);
                    this.httpHandler.handleError(err.message, this.showNotify);
                }).then(() => {
                    if (config.loading) {
                        this.hideLoading();
                    }
                });
        });

    }
    /**
    * return new Promise<any>
    */
    public postPromise(path, body: any = null, config: any = this.defaultConfig): Promise<any> {

        Object.assign(config, {
            saveFile: config.saveFile || false,
            tableName: config.tableName || '',
            useId: config.useId || true,
            preFileName: config.preFileName || ''
        });
        const headers = this.createHeader();
        //
        return new Promise((resolve, reject) => {
            if (config.loading) {
                this.showLoading();
            }
            return this.http.post(this.BaseURL + path, body, { headers: headers })
                .toPromise()
                .then(response => {
                    if (response['Succeed'] === true) {
                        // console.log(json);
                        if (config.useId && response['Result'] && response['Result']['ID']) {
                            //this.save files  after check file names is null
                            this.fileService.setFileInfo(null, config.tableName, response['Result']['ID'])
                        }

                        if (response['Result'] && config.saveFile == true) {
                            this.saveConfirmFile(response['Result'], config.preFileName)
                        }
                        resolve(response['Result']);
                    }
                    else {
                        const message = response['Message']['Handled'] == true ? response['Message']['Text'] : 'Network Error';
                        this.showNotify(message);
                        console.log(message);
                        console.log(this.BaseURL + path);
                        reject(message);
                    }
                }).catch(err => {
                    reject(err.message);
                    this.httpHandler.handleError(err.message, this.showNotify);

                }).then(() => {
                    if (config.loading) {
                        this.hideLoading();
                    }
                });
        });
    }
    /**
    * return Observable<Response>
    */
    // public postObservable(path, body: any = null): Observable<any[]> {
    //     const headers = this.createHeader();
    //     //
    //     return this.http.post<any[]>(this.BaseURL + path, body, {headers: headers}).pipe(
    //         retry(3),
    //         catchError(this.handleError)
    //     )
    // }



    public createHeader(): HttpHeaders {

        let Auth = '';
        let token = localStorage.getItem('token');

        if (token) {
            Auth = 'Basic ' + token;
        }

        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': Auth,
        });

        if (this.getSubject) {
            headers.set('SubjectCode', this.getSubject());
        }

        return headers;
    }



    private saveConfirmFile(entity, preFileName) {
        this.fileService.setPending(true);
        const fileInfo = this.fileService.getFileInfo();
        // entity: entity.ID, tableName: '' 
        fileInfo.files.forEach(element => {
            if (element.entityId == null) {
                element.entityId = entity.ID;
            }
            element.preFileName = preFileName;
            //  let opt = { saveFile: true, tableName: element.TableName, useId: true,preFileName: preFileName}
            this.postPromise('/EDM/File/SaveConfirm', element).then(res => {
                this.fileService.setPending();
                this.fileService.clearFileInfo();
                return res;
            });
        });
        //  fileInfo.entityId = entity.ID;

    }
}