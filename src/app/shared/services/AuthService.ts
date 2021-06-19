import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceCaller } from './ServiceCaller';
import { RouteData } from '../util/RouteData';
import { PermissionService } from '../permission';
import { MenuService } from './MenuService';
import { ConfigService } from './ConfigService';
import { ThemeService } from './ThemeService';
import { Notify } from '../util/Dialog';
import { TranslateService } from './TranslateService';
import { resolve } from 'path';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private static isLoggedIn: boolean = false;
    private static resetPass: boolean = false;

    userdeflang: string;

    redirectUrl: string = '/home';

    get displayName(): string {
        return localStorage.getItem('USER_DIS');
    }
    get description(): string {
        return localStorage.getItem('USER_DES');
    }

    get companyName(): string {
        return localStorage.getItem('USER_COM');
    }

    constructor(
        @Inject(Router) private router: Router,
        public translate: TranslateService,
        private _permissionService: PermissionService,
        private _menuService: MenuService,
        public service: ServiceCaller,
        public _configService: ConfigService,
        public _themeService: ThemeService,
        public routeData: RouteData) {
        this.checkLogin(this.redirectUrl);
    }

    logout() {
        let that = this;
        this.service.postPromise('/ADM/Security/SignOut').then(res => {
            localStorage.removeItem('token');
            localStorage.removeItem('USER_DIS')
            localStorage.removeItem('USER_DES')
            localStorage.removeItem('USER_COM')
            localStorage.removeItem('USER_LANGS')
            this._permissionService.clearStore();
            this._configService.clear();
            this._menuService.clear();
            that.router.navigate(['/login']);
        }).catch(err => {
            Notify.error(this.translate.instant(err))
            that.router.navigate(['/login']);
        })
    }

    login(username, password): Promise<void> {
        let that = this;
        let input = { username: username, password: password };
        return this.service.postPromise('/ADM/Security/SignIn', input).then(data => {
            this.initLogin(data, true);
            localStorage.setItem('token', data.Token);
        });
    }

    checkLogin(url: string): Promise<boolean> {
        console.log('checkLogin');
        let that = this;
        return new Promise((resolve, reject) => {
            var token = localStorage.getItem('token');
            if (AuthService.isLoggedIn == true && token) {
                if (AuthService.resetPass) {
                    resolve(false);
                    that.redirectRestPass(url);
                }
                else {
                    resolve(true);
                }
            }
            else if (token) {
                AuthService.isLoggedIn = false;
                this.service.postPromise('/ADM/Security/SignIn', { token: token }).then(data => {
                    that.initLogin(data, false);
                    if (AuthService.resetPass) {
                        resolve(false);
                        that.redirectRestPass(url);
                    }
                    else {
                        resolve(true);
                    }
                }).catch(() => {
                    resolve(false);
                    this.logout();
                });
            } else {
                resolve(false);
                that.redirectLogin(url);
            }
        });
    }


    private initLogin(data, redirect: boolean) {
        localStorage.setItem('token', data.Token);
        localStorage.setItem('USER_DIS', data.DisplayName);
        localStorage.setItem('USER_DES', data.Description);
        localStorage.setItem('USER_COM', data.CompanyName);
        localStorage.setItem('USER_LANGS',  JSON.stringify(data.langs));
        this.userdeflang = data.Defaultlang;
        AuthService.resetPass = data.ResetPass;
        this._permissionService.fillMenuPermissions(data);
        this._menuService.setList(data.Subjects);
        this._configService.load().then(() => {
            AuthService.isLoggedIn = true;
            this._themeService.set();
            if (redirect)
                this.redirectPrevious();
        });
    }



    private redirectRestPass(url: string) {
        AuthService.isLoggedIn = false;
        this.redirectUrl = url;
        this.router.navigate(['/setpass']);
    }

    private redirectLogin(url: string) {
        AuthService.isLoggedIn = false;
        this.redirectUrl = url;
        this.router.navigate(['/login']);
    }

    private redirectPrevious() {
        this.router.navigate([this.redirectUrl]);
        this.translate.Refresh_DIC(this.userdeflang, true);
    }

    public restPassword(newPass: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.service.postPromise('/ADM/Security/User/ResetPassword', { password: newPass }).then(data => {
                AuthService.resetPass = false;
                this.router.navigate(['/home']);
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }

}
