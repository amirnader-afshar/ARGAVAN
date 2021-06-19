import { Injectable } from "@angular/core";
import { ServiceCaller } from "./ServiceCaller";
import { Dialog, Notify } from "../util/Dialog";
import { Router } from "@angular/router";
import { TranslateService } from "./TranslateService";

@Injectable()
export class ConfigService {

    private static data: any[]=[];

    constructor(
        private service: ServiceCaller,
        private router: Router,
        private translate: TranslateService) {

    }

    public load(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!ConfigService.data || !ConfigService.data.length) {
                this.service.getPromise('/ADM/Config/User/List').then((data) => {
                    ConfigService.data = data;
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            }
            else {
                resolve();
            }
        });

    }


    public reload(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.service.getPromise('/ADM/Config/User/List').then((data) => {
                ConfigService.data = data;
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });

    }



    public get(key: string): string {
        let item = ConfigService.data.find(c => c.Key == key);
        if (item && item.Value == null && item.Required) {
            Notify.error(this.translate.instant('PUB_CONFIG_MISSING_ERROR').replace('{0}', item.Title));
            this.router.navigate(['/adm/user/configs'], { queryParams: { key: key } });
        }
        return item != null ? item.Value : null;
    }

    public clear() {
        ConfigService.data = [];
    }




}