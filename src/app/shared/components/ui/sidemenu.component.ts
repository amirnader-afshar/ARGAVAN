import { Component, Input, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from 'angular-event-service/dist';
import { Router, NavigationEnd } from '@angular/router';
import { ServiceCaller } from "../../services/ServiceCaller";
import { MenuService } from "../../services/MenuService";
import { AuthService } from "../../services/AuthService";
import { RouteData } from '../../util/RouteData';
import { Subscription } from 'rxjs';

declare function page_refresh_menu(): any;

@Component({
    selector: 'side-menu',
    templateUrl: './sidemenu.component.html'
})
export class NavSideMenuComponent implements OnDestroy {

    list: any[];
    private url: string;
    lastUrl: string;
    public selected: any = null;
    public backItem: any = null;
    private _routerSub = Subscription.EMPTY;

    constructor(
        private menuService: MenuService,
        private eventsService: EventsService,
        private router: Router,
        public authService: AuthService,
        private routeData: RouteData
    ) {
        let that = this;
        this._routerSub = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event) => {
                that.url = (event as NavigationEnd).url;
                if (that.url != this.lastUrl) {
                    that.createMenu(that.url);
                    that.lastUrl = that.url;
                }
            });

        console.log("recreate menu");
    }

    ngOnDestroy() {
        this._routerSub.unsubscribe();
    }

    createMenu(url: string) {
        let that = this;
        that.selected = null;
        that.backItem = null;
        this.menuService.getItemsByUrl(url).then(data => {
            let cloned = data.concat();
            if (cloned.length > 1) {
                that.list = cloned.map(x => {
                    let y = Object.assign({}, x);
                    y.Items = [];
                    y.hasArrow = false;
                    return y;
                });
                page_refresh_menu();
            }
            else {
                that.selected = cloned[0];
                if (that.selected) {
                    that.list = that.selected.Items;
                    let parent = that.selected.parent;
                    let lastParent = parent;
                    while (parent) {
                        lastParent = parent;
                        parent = parent.parent;
                    }
                    that.backItem = lastParent ? lastParent : null;
                    page_refresh_menu();
                }
            }
        });
    }

    navigateTo(item) {
        if (item.TypeId == 4 && item.Path)
            this.router.navigateByUrl(item.Path);
        else if (!(item.Items && item.Items.length) && item.Path)
            this.router.navigateByUrl(item.Path);
        else if ((item.TypeId == 1) && item.Path)
            this.router.navigateByUrl(item.Path);
    }
}
