import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class PermissionHelper {
    constructor() { }

    public ApplyStrategie(strategie: string, element: ElementRef) {
        switch (strategie) {
            case "enable":
                element.nativeElement.removeAttribute("disabled");
                break;
            case "disable":
                element.nativeElement.setAttribute("disabled", "true");
                break;
            case "show":
                element.nativeElement.style.display = 'inherit';
                break;
            case "hide":
                element.nativeElement.style.display = 'none';
                break;
            default:
                throw "<enable, disable, show, hide> لطفا یکی از مقادیر روبرو را تعریف کنید";
        }
    }
}