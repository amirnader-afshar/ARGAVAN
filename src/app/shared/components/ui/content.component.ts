import { Component, Input, ContentChild, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';

@Component({
    selector: 'page-content',
    template: '<div class="page-content"><div class="inner-content"><ng-content></ng-content></div></div>'
})
export class PageContentComponent {
    
}
