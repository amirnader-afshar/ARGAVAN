import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { MenuService } from "../../services/MenuService";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-breadcrumbs',
    template: `
    <div class="breadcrum">
     <ul>
        <li *ngIf="breadcrumbs.length && breadcrumbs[0].url!='/home'">
          <a routerLink="/home">
          {{'PUB_HOME' | translate}}
          </a>
        </li>
        <li *ngFor="let item of breadcrumbs">
          <a [routerLink]="item.url">
            {{item.title}}
          </a>
        </li>
      
      </ul>
    </div>`
})
export class BreadcrumbsComponent implements OnDestroy {

    breadcrumbs: Array<any> = new Array<any>();
    private _routerSub = Subscription.EMPTY;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private menuService: MenuService
    ) {
        let that = this;
        this._routerSub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event) => {
            this.breadcrumbs = [];
            that.create();
        });
    }

    ngOnDestroy() {
        this._routerSub.unsubscribe();
    }

    async create() {
        //TODO: check after init view for additional get method to fill data
        
        let c = await this.menuService.getCurrentUrlSegments();
        for (var i in c) {
            this.breadcrumbs.push({ title: c[i].Title, url: c[i].Path })
        }
    }
}
