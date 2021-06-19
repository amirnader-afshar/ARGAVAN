import { Component, Input, Output, TemplateRef, ViewContainerRef, ViewChild, EventEmitter, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { DxTextBoxComponent } from 'devextreme-angular';
import { DateTime, DateTimeFormat } from '../../util/DateTime'
import { DatePipe } from '@angular/common';

const FORMAT_DATE = /([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/;
const FORMAT_DATE_TIME = /([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])) ([0-1]\d|2[0-3]):([0-5]\d)/;

@Component({
    selector: 'dx-date',
    templateUrl: "./dx-date-picker.html",
    inputs: ["value"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DXDateBoxComponent implements AfterViewInit {

    @Input() maxDate;
    @Input() minDate;
    @Input() disabled;
    @Input() maxTime;
    @Input() minTime;

    @ViewChild('textbox', {static: true}) textBox: DxTextBoxComponent;
    @ViewChild('textboxValidator', { static: false }) textboxValidator;  
    constructor(private cdr: ChangeDetectorRef) {

    }
    clear() {
        this._value = null;
        this.value = null;
    }

    onFocusOut(e) {
        if (e.component._value.trim() == "") {
            this.clear();
        }
    }
    ngOnInit() {

    }

    ngAfterViewInit() {
        if (this.textBox.instance) {

            var validator = this.textboxValidator;
            var rules: any[] = [];
            rules.push({
                type: 'pattern',
                pattern: this.mode == "date" ? FORMAT_DATE : FORMAT_DATE_TIME,
                message: 'تارخ وارد شده صحیح نمی باشد'
            });
            if (this.required) {
                rules.push({ type: "required", message: "این فیلد اجباری است" })
                validator.instance.option("validationRules", rules);
            }
        }
        setTimeout(() => {
            if (this.showToday && (this.value == null || this.value == undefined || this.value == null)) {
                this.value = DateTime.convertToIso(new Date());
                this.cdr.markForCheck();
            }
        }, 2000);
    }



    get mask(): string {
        if (this.mode == "date")
            return "9999/99/99";
        else
            return "9999/99/99 99:99";
    }




    @Input()
    required: boolean = false;

    @Input()
    allowClear: boolean = false;

    @Input()
    disableTime: boolean = false;

    // value
    @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

    //
    _value: string;
    @Input()
    get value(): string {
        return this._value;
    }

    set value(val: string) {
        if (val === null && this.textBox.instance) {
            // this.clear();
            this.textBox.instance.option("value", '');
            this.valueChange.emit(null);
            return;
        }
        if (!val && !this.value) {
            this.valueChange.emit(val);
            return;
        }
        if (!val && this.value) {
            val = this._value;
            this.valueChange.emit(val);
            return;
        }
        if (val != this._value) {
            // if (val != undefined)
            //     return;
            this._value = val;
            setTimeout(() => {
                if (this.textBox.instance) {
                    let valStr: string = null;
                    if (this.mode == "date") {
                        valStr = DateTime.convertToLocal(val, DateTimeFormat.Date);
                    }
                    else {
                        valStr = DateTime.convertToLocal(val, DateTimeFormat.DateTime);
                    }
                    // this.textBox.value = valStr;
                    this.textBox.instance.option("value", valStr);

                }
            }, 10);
            if (val)
                this.valueChange.emit(val);
        }
    }


    // readonly
    @Output() readOnlyChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    _readOnly: boolean = null;
    @Input()
    get readOnly(): boolean {
        return this._readOnly;
    }

    set readOnly(val: boolean) {
        this._readOnly = val;
        this.readOnlyChange.emit(this._readOnly);

    }



    @Input()
    showToday: boolean = false;

    @Input()
    mode: string = "date";



    onTextChange(val) {
        // debugger
        // if (val.replace(/\//g, '').trim() == '') {
        //     this.clear();
        //     return null;
        // }
        // if (!val && !this.value) {
        //     // val = DateTime.convertToLocal(this.value);
        //     return;
        // }
        // if (this.mode == "date") {
        //     if (FORMAT_DATE.test(val)) {
        //         this.value = DateTime.convertForRemote(val);
        //     }
        // }
        // else {
        //     if (FORMAT_DATE_TIME.test(val)) {
        //         this.value = DateTime.convertForRemote(val);
        //     }
        // }
    }

    onKeyDown(e) {
        if (e.event.key == "ArrowUp") {
            if (this.value == null) {
                this.setToday();
            }
            else {

            }
        }
        else if (e.event.key == "ArrowDown") {
            if (this.value == null) {
                this.setToday();
            }
            else {

            }
        }
    }

    setToday() {
        if (!this.readOnly)
            this.value = DateTime.convertToIso(new Date());
    }
}
