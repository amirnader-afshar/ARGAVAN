import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BasePage, PopupBasePage } from '../BasePage';
import { ServiceCaller } from '../services/ServiceCaller';
import { AuthService } from '../services/AuthService';
import { TranslateService } from '../services/TranslateService';

@Component({
    templateUrl: './popup.test.html'
})

export class PopupTest extends PopupBasePage implements OnInit {
    ngOnInit() {

    }
    CurrentUser: any;
    //ShowRequestItems: boolean = true;
    //ShowConfirmItems: boolean = false;

    //ParentId
    @Output()
    prIdChange: EventEmitter<any> = new EventEmitter<any>();

    _prId: any;
    @Input()
    get prId(): any {
        return this._prId;
    }

    set prId(val: any) {
        this._prId = val;
        this.prIdChange.emit(this._prId);
    }

    //mode
    @Output()
    modeChange: EventEmitter<string> = new EventEmitter<string>();

    _mode: string;
    @Input()
    get mode(): string {
        return this._mode;
    }


    set mode(val: string) {
        this._mode = val;
        console.log("mode changes");
        this.modeChange.emit(this._mode);
    }
    // ClosePopup
    @Output()
    ClosePopupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    _ClosePopup: boolean;
    @Input()
    get ClosePopup(): boolean {
        return this._ClosePopup;
    }

    set ClosePopup(val: boolean) {

        this._ClosePopup = val;
        console.log("visible changes");
        this.ClosePopupChange.emit(this._ClosePopup);
    }

    // Visible
    @Output()
    visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    _visible: boolean;
    @Input()
    get visible(): boolean {

        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;
        if (val == true && this.mode == "Request") {

            this.service.get("/HTL/CleaningRequest/GenerateDoneNumber", (data) => {

                this.filter.DoneNumber = data;

            });

            this.service.get("/HTL/CleaningRequest/GetCurrentCleaner", (data) => {

                setTimeout(() => {

                    this.CurrentUser = data;

                }, 100)
            });

        }
        if (val == true && this.mode == "Confirm") {
            this.service.get("/HTL/CleaningRequest/GetCurrentCleaner", (data) => {

                setTimeout(() => {

                    this.CurrentUser = data;
                }, 100)
            });
        }
        console.log("visible changes");
        this.visibleChange.emit(this._visible);
    }

    GetCurrentUser() {
    }
    ShowRequestItems(): boolean {



        return this.mode == "Request";
    }

    ShowConfirmItems(): boolean {

        return this.mode == "Confirm";
    }
    filter: any = {};
    constructor(public service: ServiceCaller, public translate: TranslateService,
        public Authservice: AuthService, private _cdr: ChangeDetectorRef) {
        super(translate);
    }

    Submit() {
        let param: any = {};
        Object.assign(param, this.filter);
        param.ID = this._prId;
        param.StatusMode = 1;
        this.service.post("/HTL/CleaningRequest/Save", (data) => {
            this.filter = {
                DoneNumber: null, DoneDate: null, DoneTime: null, CleanerId: null, Cleaner: null, Description: null,
                ConfirmDate: null, ConfirmTime: null, CleanerParentId: null, CleanerParent: null, DescriptionHead: null
            };
            this.visible = false;
            this.close();
            this._cdr.detectChanges();
        }, param);
    }

    Confirm() {
        let param: any = {};
        Object.assign(param, this.filter);
        param.ID = this._prId;
        param.StatusMode = 2;
        this.service.post("/HTL/CleaningRequest/Save", (data) => {
            this.filter = {
                DoneNumber: null, DoneDate: null, DoneTime: null, CleanerId: null, Cleaner: null, Description: null,
                ConfirmDate: null, ConfirmTime: null, CleanerParentId: null, CleanerParent: null, DescriptionHead: null
            };
            this.visible = false;
            this.close();
            this._cdr.detectChanges();
        }, param);


    }
    close(ev = null) {
        debugger
        this.popupInstance.result('salam')
        this.popupInstance.close();
        this.ClosePopup = true;
    }
}