import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
@Injectable()
export class HttpClientHandler {
    handleError(message, notify) {
        if (environment.production === false) {
            if (!message)
                message = 'Ooops! Bad Request Error';
            notify(message)
            console.error(message)
        }
    }
}
