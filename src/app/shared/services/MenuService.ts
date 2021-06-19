import { Injectable } from '@angular/core';
import { ServiceCaller } from './ServiceCaller';
import { PermissionService } from '../permission';


@Injectable({
    providedIn: 'root',
})
export class MenuService {

    private static data: any[];
    selectedMenu: string;

    constructor(private service: ServiceCaller, private _permissionService: PermissionService) {

    }
    getRemoteList(): Promise<any> {
        //TODO: set loading
        return this.service.getPromise('/ADM/Menu/User/List');
    }

    public getModuleList(): Promise<any[]> {
        const that = this;
        return new Promise((resolve, reject) => {
            that.getMenuList().then(data => {
                const filteredDat = data.filter(res => res.TypeId == 1 && res.Items.some(c => c.IsMenu))
                resolve(filteredDat)
            });
        })
    }

    public getMenuList(): Promise<any> {
        const that = this;
        
        if (MenuService.data) {
            return new Promise((resolve, reject) => {
                resolve(MenuService.data)
            })
        }
        else {
            console.log("load menu from remote");
            return this.getRemoteList().then(data => {
                that._permissionService.fillMenuPermissions(data);
                that.setList(data);
                return data;
            })
        }
    }

    public setList(data) {
        this.setParents(null, data);
        MenuService.data = data;
    }

    public getItemsByCode(code: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.getMenuList().then(data => {
                let systemMenu = data.filter(c => c.Code == code);
                const list: any[] = systemMenu.length ? systemMenu[0].Items : [];
                if (list.length == 0) {
                    list.push({ Title: "لیست سیستم ها", Path: "#", Icon: "fa-list" });
                }
                resolve(list);
            });
        });
    }

    public getItemByCode(code: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getMenuList().then(data => {
                let systemMenu = data.filter(c => c.Code == code);
                if (systemMenu.length == 0) {
                    resolve(null);
                }
                else {
                    resolve(systemMenu[0]);
                }

            });
        });
    }

    public getCurrentUrlSegments(): Promise<any[]> {
        const that = this;

        let hash = window.location.href.split(/[?#]/)[1];
        return new Promise((resolve, reject) => {
            that.getMenuList().then(data => {
                const result: any[] = [];
                that.findItem(hash, data, result);
                resolve(result.reverse());
            });
        });
    }

    private setParents(parent: any, items: any[]) {
        for (let i in items) {
            const item = items[i];
            if (parent) {
                item.parent = parent;
            }
            item.hasArrow = item.Items && item.Items.filter(c => c.IsMenu).length;
            this.setParents(item, item.Items);
        }
    }

    private findItem(path: string, items: any[], result: any[]) {

        for (const i in items) {
            const root = items[i];
            if (root.Path == path) {
                result.push(root);
                let parent: any = root.parent;
                while (parent) {
                    result.push(parent);
                    parent = parent.parent;
                }
                break;
            }
            if (root.Items) {
                this.findItem(path, root.Items, result);
            }
        }
    }



    // public getActiveSystemItems(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.getItemsByCode(this.getActiveSystem()).then(c => {
    //             resolve(c);
    //         });
    //     });
    // }

    public getItemsByUrl(url: string): Promise<any[]> {
        const that = this;

        if (url.toLocaleLowerCase() == "/home") {
            return that.getModuleList();
        }
        return new Promise((resolve, reject) => {
            this.getMenuList().then(data => {
                const result: any[] = [];
                let selected: any = null;
                that.findItem(url, data, result);
                for (const i in result) {
                    if (result[i].TypeId == 2 || result[i].TypeId == 1) {
                        selected = result[i];
                        break;
                    }
                }
                resolve(selected ? [selected] : []);
            });
        });
    }

    public setActiveSystem(code: string): void {
        this.selectedMenu = code;
    }

    public getActiveSystem(): string {
        return this.selectedMenu;
    }

    public clear() {
        MenuService.data = null;
    }
}
