import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from './Repository';
import { EventsService } from 'angular-event-service/dist';
import { HttpClientHandler } from '../errorHandler/http-error.tldr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare function $params(obj: any): string;


@Injectable()
export class FileRepository extends Repository {
    constructor(protected http: HttpClient, protected eventsService: EventsService, public httpHandler: HttpClientHandler) {
        super(http, eventsService, httpHandler);
    }
    /**
      * return Observable<Response>
      */
    public postFile(path, body: any = null): Promise<any> {
        let headers = this.createHeaderFile();
        
        //
        return new Promise((resolve, reject) => {

            return this.http.post(this.BaseURL + path, body, { headers: headers })
                .toPromise().then(response => {
                    resolve(response);
                }).catch(err => {
                    reject(err)
                })
        })
        //.then(response => response.json().Result);
    }

    /**
    * Get File, Return Primose<any>
    */
    public getfileList(path = '/EDM/File/List', params: any = null): Promise<any> {
        let headers = this.createHeader();
        let url = this.BaseURL + path;
        return new Promise((resolve, reject) => {
            let q = $params(params);
            if (q !== '') {
                if (url.indexOf('?') > 0) {
                    url = url + '&' + q;
                }
                else {
                    url = url + '?' + q;
                }
            }
            this.http.get(url, { headers: headers }).toPromise().then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })

    }

    /**
    * return Observable<Response>
    */
    public getfileObservable(path, params: any = null): Observable<Response> {
        let headers = this.createHeader();
        let url = this.BaseURL + path;
        let q = $params(params);
        if (q != '') {
            if (url.indexOf('?') > 0) {
                url = url + '&' + q;
            }
            else {
                url = url + '?' + q;
            }
        }
        // console.log("get=> " + url);
        return this.http.get<Response>(url, { headers: headers });
    }

    public createHeaderFile(): HttpHeaders {

        const headers = new HttpHeaders()
        .set('Authorization','Basic ' + localStorage.getItem('token'));

        //let headers = new HttpHeaders();
        //  headers.append('Content-Type', 'application/x-www-form-urlencoded');
        //  headers.append('Accept', 'application/json');
        // let token = localStorage.getItem('token');
        // if (token) {
        //     headers.append('Authorization', 'Basic ' + localStorage.getItem('token'));
        // }
        return headers;
    }
}
