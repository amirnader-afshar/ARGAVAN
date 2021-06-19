import { Component } from '@angular/core';
import { Router } from "@angular/router";


@Component({
    selector: 'not-found-page',
    template: '<h1>Not found page</h1>',
})

export class NotFoundPage  {

  
    constructor(public router: Router) { }
}
