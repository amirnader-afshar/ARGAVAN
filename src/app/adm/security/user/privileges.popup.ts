import { Component, Input, ViewChild, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { PopupBasePage } from '../../../shared/BasePage';
import { ADMPrivilegeComponent } from '../../setup/privilages.component';
import { CoreService } from '../../../shared/services/CoreService';


@Component({
    templateUrl: './privileges.popup.html',
    selector:'adm-privileges-afshar'
})
export class ADMPrivilegePopupPage extends PopupBasePage implements OnInit {

    ngOnInit() {
        // this.level = this.popupInstance.data.level;
        // this.itemId = this.popupInstance.data.itemId;
    }

    @ViewChild('prv',{static: false}) prv: ADMPrivilegeComponent;


    @Input()
    itemId: string;

    @Input()
    level: string

    constructor(public core: CoreService) {
        super(core.translate);
    }

    onApplyClick(e) {
        this.prv.saveChanges().then(() => {
            //this.onCloseClick();
        });;
    }

    onCloseClick() {
        this.popupInstance.close();
    }
}