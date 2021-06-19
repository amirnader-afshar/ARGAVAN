import { Component, OnInit } from '@angular/core';
import config from 'devextreme/core/config';
import { EventsService } from 'angular-event-service/dist';
import { ServiceCaller } from "../services/ServiceCaller";
import { RouteData } from "../util/RouteData";
import { MenuService } from '../services/MenuService';
import { Router } from '@angular/router';

declare function home_refresh_menu(): any;

@Component({
    selector: 'home-page',
    templateUrl: './home.page.html'
})
export class HomePage implements OnInit {

    list: any[];

    ngOnInit(): void {
        let that = this;
        this._menuService.getModuleList().then(res => {
            that.list = res;
        })
    }

    constructor(
        private eventsService: EventsService, 
        private service: ServiceCaller, 
        private routeData: RouteData, 
        private router: Router, 
        private _menuService: MenuService) {

    }


    selectSystem(item: any) {
        this.router.navigate([item.Path.trim()]);
    }
}
