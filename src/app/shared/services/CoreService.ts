import { Injectable } from '@angular/core';
import { ConfigService } from './ConfigService';
import { ServiceCaller } from './ServiceCaller';
import { TranslateService } from './TranslateService';
import { DemisPopupService } from '../components/popup/demis-popup-service';
import { PermissionService } from '../permission';
import { RouteData } from '../util/RouteData';
import { EventsService } from 'angular-event-service/dist';
import { DialogService, NotifyService } from '../util/Dialog';
import { FileExplorerManager } from '../components/fileExplorer/fileexplorer.service';

@Injectable()
export class CoreService {

    private _subjectCode: string = null;
    public setSubject(code: string): void {
        this._subjectCode = code;
    }

    constructor(
        public http: ServiceCaller,
        public config: ConfigService,
        public translate: TranslateService,
        public popup: DemisPopupService,
        public dialog: DialogService,
        public notify: NotifyService,
        public permission: PermissionService,
        public routeData: RouteData,
        public fileExplorer: FileExplorerManager,
        public events: EventsService
    ) {
        http.getSubject = () => {
            return this._subjectCode;
        };
    }
}