import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
import { AuthService } from './AuthService';
import { IPermissionGuardModel, PermissionService } from '../permission';
import { DemisInjector } from '../util/Injector';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private _permissionService: PermissionService, private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.authService.checkLogin(state.url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        //use this line for access routes to service
        DemisInjector.currentRoute = route;
        return new Promise((resolve, reject) => {
            resolve(true);
            // if (this._permissionService.store.length > 0) {
            //     let data = route.data["Permission"] as IPermissionGuardModel;
            //     if (data) {
            //         if (Array.isArray(data.Only) && Array.isArray(data.Except))
            //             throw "نمیتوان هر دوی 'Obly', 'Except' رو در اعمال کرد";
            //         if (Array.isArray(data.Only)) {
            //             let hasDefined = this._permissionService.hasOneDefined(data.Only, 'Path')
            //             if (hasDefined)
            //                 resolve(true);
            //             if (data.RedirectTo && data.RedirectTo !== undefined)
            //                 this.router.navigate([data.RedirectTo]);
            //             resolve(false);
            //         }

            //         if (Array.isArray(data.Except)) {
            //             let hasDefined = this._permissionService.hasOneDefined(data.Except, 'Path')
            //             if (!hasDefined)
            //                 resolve(true);
            //             if (data.RedirectTo && data.RedirectTo !== undefined)
            //                 this.router.navigate([data.RedirectTo]);
            //             resolve(false);
            //         }
            //     } else {
            //         let hasDefined = this._permissionService.hasDefined((<any>route).routeConfig.path, 'Path');
            //         if (hasDefined)
            //             resolve(true);
            //     }
            //     resolve(false);
            // } else {
            //     //TODO: fetch user accesses 
            //     this.canActivate(route, state);
            //     // resolve(true);
            // }
        });
    }


}
