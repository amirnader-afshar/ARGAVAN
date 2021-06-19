import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/MenuService';
import { ActivatedRoute, Router } from '@angular/router';

declare function home_refresh_menu(): any;

@Component({
    selector: 'module-home-page',
    templateUrl: './module-home.page.html'
})
export class ModuleHomePage implements OnInit {

    module: any = {};
    subs: any[] = [];


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private menuService: MenuService) {

    }

    ngOnInit() {
        let code = this.route.snapshot.data["code"];
        console.error(code);
        
        if (code != null) {
            this.menuService.getItemByCode(code).then(c => {
                this.generateMenu(c);
            });
        }
        else {
            this.route.params.subscribe(params => {
                code = params["code"];
                this.menuService.getItemByCode(code).then(c => {
                    this.generateMenu(c);
                });
            });
        }
    }

    private generateMenu(module: any) {
        this.module = module;
        if (this.module && this.module.Items && this.module.Items.length) {
            this.module.Items.forEach(i => {
                if (i.TypeId == 2)
                    this.subs.push(i);
            });
        }
    }

    private selectSystem(item: any) {
        if (item.Path)
            this.router.navigate([item.Path.trim()]);
    }


}
