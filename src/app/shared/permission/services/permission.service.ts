import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemisInjector } from '../../util/Injector';
export enum Action {
    DisableAll,
    EnableAll
}

@Injectable()
export class PermissionService {
    private static _permissionStore: Array<any> = [];
    private _permissionStoreChange: EventEmitter<any> = new EventEmitter();

    constructor() {
    }
    /**
     * fill permission list from server
     * @param data data from Subject table or user login
     */
    public fillMenuPermissions(data) {
        let temp = [];
        // const deepFlatten = (arr, isChild = false) => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(isChild ? (<any>v).Items : v) : v)));
        var deepFlatten = (arr) => [].concat(...arr.map(v => (v.Items.length > 0 ? deepFlatten(v.Items) : v)));
        let childs = deepFlatten(Array.isArray(data) ? data : data.Subjects)
        let parents = data.Subjects || data || [];
        let permissions = [];
        [...childs, ...parents].forEach(element => {
            if (element)
                permissions.push(element);
        });
        this.define(permissions);
    }
    /**
     * define initial permissions
     * @param permissions Array<any>
     */
    public define(permissions: Array<any>): void {
        if (!Array.isArray(permissions))
            throw "پارامتر های دسترسی باید آرایه باشند";

        this.clearStore();
        for (let permission of permissions)
            this.add(permission);
    }
    /**
     * add permission to list
     * @param permission object : {}
     */
    public add(permission: any): void {
        if (!this.hasDefined(permission)) {
            PermissionService._permissionStore.push(permission);
            this._permissionStoreChange.emit(null);
        }
    }

    public remove(permission: any, element: string = 'Code'): void {
        if (typeof permission !== "string")
            return;
        PermissionService._permissionStore.forEach((item, index) => {
            if (item[element] === permission[element])
                //TODO: remove from list
                PermissionService._permissionStore.splice(index, 1);
        })
        this._permissionStoreChange.emit(null);
    }
    /**
     * check permission defined
     * @param permission any
     * @param element string element of object (default is 'Code')
     */
    public hasDefined(permission: any, element: string = 'Code'): boolean {
        if (typeof permission !== "string")
            return false;
        if (this.ensure(permission))
            return true;
        let query = PermissionService._permissionStore.map(function (e) { return e[element]; })
        let index = query.indexOf('/' + permission);
        if (index == -1) index = query.indexOf(permission);
        return index > -1;
    }
    /**
    * check permission on defined from input list
    * @param permission Array<any> input list 
    * @param element string element of object (default is 'Code')
    */
    public hasOneDefined(permissions: Array<string>, element: string = 'Code'): boolean {
        if (!Array.isArray(permissions))
            throw "پارامتر های دسترسی باید آرایه باشند";

        return permissions.some(v => {
            if (typeof v === "string")
                return PermissionService._permissionStore.map(function (e) { return e[element]; }).indexOf('/' + v) >= 0;
        });
    }
    /**
    * clear permission list
    */
    public clearStore(): void {
        PermissionService._permissionStore = [];
    }
    /**
     * get permission list
     */
    get store(): Array<string> {
        return PermissionService._permissionStore;
    }
    /**
     * get permission emmiter change
     */
    get permissionStoreChangeEmitter(): EventEmitter<any> {
        return this._permissionStoreChange;
    }

    public applyPermission(formCode: string, action: Action, ...args) {
        if (action === null || action.toString() === Action[Action.EnableAll]) {
            localStorage.setItem('TPDemis', formCode.split(',')[1]);
            return;
        }
        localStorage.removeItem('TPDemis');
        PermissionService._permissionStore.forEach((element, index) => {
            if (action.toString() === Action[Action.DisableAll])
                if (element.Code.startsWith(formCode.split(',')[1]))
                    PermissionService._permissionStore.splice(index, 1);
        });
    }

    public completePermission() {
        localStorage.removeItem('TPDemis')
    }

    private ensure(permission: any) {
        let formCode = localStorage.getItem('TPDemis');
        let route = DemisInjector.currentRoute;
        if (permission.startsWith(formCode) && route.queryParams['isWFM'] && route.queryParams['isWFM'].toString() === 'true')
            return true;
        return false;
    }
}
