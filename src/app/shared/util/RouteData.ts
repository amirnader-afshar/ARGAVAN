import { Injectable, Optional } from '@angular/core';
import { RouteDataConfig } from './RouteDataConfig';

@Injectable({
    providedIn: 'root',
})
export class RouteData {

    public storage: any;


    constructor(@Optional() config: RouteDataConfig) {
        if (config) { this.storage = config.storage; }
    }

    public pop(key: string) {
        let result = this.storage[key];
        this.storage[key] = null;
        return result;
    }

    public push(key: string, value: any) {
        this.storage[key] = value;
    }

    clear() {
        this.storage = {};
    }
}
