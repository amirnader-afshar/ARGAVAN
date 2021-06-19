import { ErrorHandler, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Notify } from "../util/Dialog";
@Injectable({
    providedIn: 'root',
})
export class DemisErrorHandler implements ErrorHandler {
    handleError(error) {
        if (environment.production === false) {
            Notify.error(error.message)
            console.error(error)
        }
        // do something with the exception
    }
}