import { Inject, Injectable } from '@angular/core';
import { FileRepository } from './FileRepository';
import { EventsService } from 'angular-event-service/dist';
import { HttpClientHandler } from '../errorHandler/http-error.tldr';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';



declare function $params(obj: any): string;


@Injectable()
export class ServiceCaller extends FileRepository {

    // http: HttpClient;

    constructor(protected http: HttpClient,
        protected eventsService: EventsService,
        public httpHandler: HttpClientHandler) {
        super(http, eventsService, httpHandler);
        this.http = http;
    }
    public get(path, callback, params: any = {}, onError = null, showLoading: boolean = true) {
        const headers = this.createHeader();

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

        if (showLoading) {
            super.showLoading();
        }

        this.http.get(url, { headers: headers })

            .toPromise()
            .then(response => {

                super.hideLoading();

                if (response['Succeed'] === true) {
                    callback(response['Result']);
                } else {
                    const message = response['Message']['Handled'] === true ? response['Message']['Text'] : 'Network Error';
                    this.showNotify(message);
                    console.log(message);
                    if (onError != null) {
                        onError();
                    }
                }
            }).catch(err => {
                this.httpHandler.handleError(err.message, this.showNotify);
                super.hideLoading();
            });
    }

    public post(path, onCallback, body: any = null, onError = null, showLoading: boolean = true) {
        const headers = this.createHeader();
        //
        if (showLoading) {
            super.showLoading();

        }
        return this.http.post(this.BaseURL + path, body, { headers: headers })
            .toPromise()
            .then(response => {
                super.hideLoading();
                let result;
                if (response['Succeed'] === true) {
                    result = onCallback(response['Result']);
                } else {
                    const message = response['Message']['Handled'] === true ? response['Message']['Text'] : 'Network Error';
                    this.showNotify(message);
                    console.log(message);
                    if (onError != null) {
                        onError(message);
                    }
                }
                return result || response['Result'];
            }).catch(err => {
                this.httpHandler.handleError(err.message, this.showNotify)
                super.hideLoading();
            });
    }

    public getfile(path, callback, params: any = null, onError = null) {
        const headers = this.createHeader();
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
        super.showLoading();
        this.http.get(url, { responseType: 'text', headers: headers })
            .subscribe((data: any) => {
                super.hideLoading();
                console.log('serviceCaller (getfile)', data);

                if (data.startsWith('<!DOCTYPE html>')) {
                    window.open(environment.url + JSON.parse(JSON.stringify(data)), '_blank');
                } else {

                    window.open(environment.url + data.slice(1, -1), '_blank');
                }
                callback(data);
            });
    }


    base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            const ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }


    // private handleError(error: any) {
    //     let errMsg = (error.message) ? error.message :
    //         error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    //     this.showNotify(errMsg);
    //     return Observable.throw(errMsg);
    // }


    public loadLovData(code: string, callback: (items: any[]) => void, params: any = null): void {
        const paramList = [];

        for (const i in params) {
            paramList.push({ Name: i, Value: params[i] });
        }
        this.get('/SYS/FORMS/List', (data) => {
            callback(data.Data);
        },
            {
                Code: code,
                Params: paramList
            })
    }


}

