import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';


import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log('Intercepting Request:', request);

    return next.handle(request).pipe(

      catchError((err: HttpErrorResponse) => {

        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error(`An error occurred: "${err.error.message}" `);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(`Backend returned code: '${err.status}', body was: '${err.error}' , Error Message: '${err.message}'`);
        }

        // ...optionally return a default fallback value so app can continue (pick one)
        // which could be a default value
        return of(new HttpResponse({
          body: [
            { name: 'Default values returned by Interceptor', id: 88 },
            { name: 'Default values returned by Interceptor(2)', id: 89 }
          ]
        }));

        // or simply an empty observable
        // return Observable.empty<HttpEvent<any>>();
      }));
  }
}