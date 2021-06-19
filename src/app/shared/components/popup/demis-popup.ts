
import { Component, ViewContainerRef, ViewChild, OnDestroy, OnInit } from "@angular/core";

@Component({
    templateUrl: "./demis-popup.html"
})
export class DemisPopup implements OnDestroy, OnInit {
    ngOnInit(): void {
        console.log(this.vcr);
        let template = (<any>this.vcr)._embeddedViews[0];
        template.nodes.forEach(node => {
            if (node.instance) {
                node.instance.popupInstance = this.config;
            }
        });
    }

    close() {
        this.config.visible = false;
        setTimeout(() => {
            this.ngOnDestroy();
        }, 200);
    }

    ngOnDestroy(): void {
        // this.vcr.elementRef.
        // this.config.visible = false;
    }
    // static viewContainerRef: ViewContainerRef;
    @ViewChild('innerPopupContainer', { read: ViewContainerRef, static: true }) vcr: ViewContainerRef;

    config: DemisPopupConfig
    /**
     *
     */
    constructor(public viewContainerRef: ViewContainerRef) {
        // DemisPopup.viewContainerRef = viewContainerRef;   

    }
}
export class DemisPopupConfig<D = any> {
    viewContainerRef?: ViewContainerRef;
    id?: string;
    showCancel?: boolean = false;
    width?: string = '600px';
    title?: string = '';
    height?: string = '400px';
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string = '80vw';
    maxHeight?: number | string;
    data?: D | null = null;
    closeOnNavigation?: boolean = true;
    children?: any;
    visible?: boolean = false
    result?: Function
    close?: Function
    show?: Function
    showClose?: Boolean = true
    // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
}

export interface ComponentType<T> {
    new(...args: any[]): T;
}

export class DemisPopupRefs<T, R = any>{
    // public _close: any;
    // public _shown: any;
    // public _submitted: any;
    // // close(fn): DemisPopupRefs<any> {
    // //     this._close = fn;
    // //     return;
    // // }
    // // result(fn): Promise<any> {
    // //     return new Promise((resolve, reject) => {
    // //         this._submitted = fn;
    // //         resolve();
    // //     })
    // // }
    // // show(fn): DemisPopupRefs<any> {
    // //     this._shown = fn;
    // //     return;
    // // }

}
