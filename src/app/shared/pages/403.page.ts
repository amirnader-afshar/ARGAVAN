import { Component } from '@angular/core';
import { Router } from "@angular/router";


@Component({
    selector: 'access-denied-page',
    template: `
    <div class="row">
        <div class="col-sm-6">
            <h1>403</h1>
        </div>
        <div class="col-sm-6">
            <img src="../../../assets/img/403.gif">
        </div>
    </div>`,
})

export class AccessDeniedPage {


    constructor(public router: Router) { }
}
