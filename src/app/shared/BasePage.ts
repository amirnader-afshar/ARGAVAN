import { Component, Inject, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { TranslateService } from './services/TranslateService';
import { Formatter } from './util/Formatter';
import { WindowView } from './util/WindowView';
import { ServiceCaller } from './services/ServiceCaller';
import { FileService } from './services/FileService';
import { DemisInjector } from './util/Injector';
import CutomizeMask from './util/Mask';
import { ConfigService } from './services/ConfigService';
import { DemisPopupConfig } from './components/popup/demis-popup';
import { environment } from '../../environments/environment';

@Component({
    template: '<div>BaseClass</div>',
    host: { '(window:keydown)': 'hotkeys($event)', '(window:keypress)': 'hotkeys($event)' },
})



export class BasePage implements OnDestroy {
    fileservice: any;
    private configService: ConfigService;
    constructor(
        public translate: TranslateService,
        public service: ServiceCaller = null,
        public _cdRef: ChangeDetectorRef = null
    ) {

        this.service = service;
        this.fileservice = DemisInjector.injector.get(FileService);
        this.configService = DemisInjector.injector.get(ConfigService);

        // this.configService.get('ADM-USER-CURRENT-BRANCH').then((data) => {
        //     this._branchId = data;
        // });

    }
    resolveImage(fileName: string): string {
        return environment.url + '/' + fileName;

    }

    get FileNames() {

        if (this.fileservice)
            return this.fileservice.getFileInfo().files;
        return null;
    }

    get format(): Formatter {
        return new Formatter();
    }


    get view(): WindowView {
        return new WindowView();
    }

    get branchId() {
        return this.configService.get('ADM-USER-CURRENT-BRANCH');
    }

    get businessUnitId() {
        return this.configService.get('ADM-USER-CURRENT-BUSINESS-UNIT');
    }

    /** Shortcuts  **/
    hotkeys(e) {

    }

    ngOnDestroy() {
        if (this._cdRef !== null &&
            this._cdRef !== undefined) {
            this._cdRef.detach();
        }

    }

    get mask(): any {
        return new CutomizeMask().mask();
    }
    get formatMask(): any {
        return new CutomizeMask().format();
    }



}

export class PopupBasePage extends BasePage {
    public popupInstance: DemisPopupConfig
}
