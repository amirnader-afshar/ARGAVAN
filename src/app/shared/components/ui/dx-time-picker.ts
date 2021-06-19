import { Component, Input, Output, TemplateRef, ViewContainerRef, ViewChild, EventEmitter, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import { DxTextBoxComponent } from 'devextreme-angular';
import { DateTime, DateTimeFormat } from '../../util/DateTime'

@Component({
    selector: 'dx-time',
    templateUrl: "./dx-time-picker.html",
    inputs: ["value"]
})
export class DXTimeBoxComponent implements AfterViewInit {
    @Input() dateDrops = 'down';
    @Input() mode = 'time';
    @Input() disableKeypress = false;
    @Input() maxTime=0;
    @Input() minTime =0;
    selectedDate: {};

    datePickerConfig = {
        drops: this.dateDrops,
        format: DateTime.convertFormat(DateTimeFormat.Time),
        disableKeypress: this.disableKeypress,
        disabled: this.readOnly,
        minTime: this.minTime,
        maxTime: this.maxTime
    }

    @ViewChild('textbox', {static: false}) textBox: DxTextBoxComponent;    
    @ViewChild('textboxvalidator', {static: false}) textboxvalidator;

    ngOnInit() {
        if (this.textValue === null)
            this.textValue = undefined;
    }

    ngAfterViewInit() {

        if (this.textBox) {
            var validator = this.textboxvalidator;
            var rules: any[] = [];
            if (this.required) {
                rules.push({ type: "required", message: "این فیلد اجباری است" })
                validator.instance.option("validationRules", rules);
            }
        }

        //if (this.required && this.textBox) {
        //    var validator = this.textBox.validator;
        //    validator.instance.option("validationRules", [{ type: "required", message: "این فیلد اجباری است" }]);
        //}

        //let that = this;
        //setTimeout(() => {
        //    if (this.showCurrent && (that.textValue == null || that.textValue == "undefined")) {
        //        let date = new Date();
        //        that.value = ((date.getHours() * 100) + date.getMinutes());
        //    }
        //}, 200);


        //if (this.showCurrent && this.textBox) {
        //    let date = new Date();
        //    this.value = (date.getHours() * 100) +  date.getMinutes();
        //}

        // setTimeout(() => {
            if (this.showCurrent && (this.textValue === undefined || this.textValue == "null" || this.textValue == "undefined")) {
                let date = new Date();
                this.value = ((date.getHours() * 100) + date.getMinutes());
            }
        // }, 200);
    }

    // ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    //     setTimeout(() => {
    //         if (this.showCurrent && (this.textValue === undefined || this.textValue == "null" || this.textValue == "undefined")) {
    //             let date = new Date();
    //             this.value = ((date.getHours() * 100) + date.getMinutes());
    //         }
    //     }, 200);
    // }

    // ngAfterContentChecked() {
    // if (this.showCurrent && (this.textValue === undefined || this.textValue == "null" || this.textValue == "undefined")) {
    //     let date = new Date();
    //     this.value = ((date.getHours() * 100) + date.getMinutes());
    // }
    // setTimeout(() => {
    //     if (this.showCurrent && (this.textValue === undefined || this.textValue == "null" || this.textValue == "undefined")) {
    //         let date = new Date();
    //         this.value = ((date.getHours() * 100) + date.getMinutes());
    //     }
    // }, 200);
    // }

    get mask(): string {

        return "99:99";
    }

    maskRules: any = {
        "H": /[0-5]/,
        "h": /[0-9]/
    };

    @Input()
    required: boolean = false;


    @Input()
    showCurrent: boolean = false;



    textValue: string;
    // value
    @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();


    @Input()
    get value(): number {

        return this.getValue();
    }

    set value(val: number) {
        if (val == undefined || val == null)
            this.textValue = undefined;
        else
            this.textValue = this.pad(val, '4');
        this.valueChange.emit(val);

    }



    getValue(): number {
        let value: number;
        if (this.textValue === undefined || this.textValue === "undefined") {
            let date = new Date();
            value = ((date.getHours() * 100) + date.getMinutes());
        }
        else if (this.textValue == "  :" || this.textValue === null)
            value = null;
        else
            value = Number(this.textValue.replace(":", "").replace(" ", ""));
        return value;
    }

    pad(num, size) {
        if (num === null || num == undefined)
            return null;
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s.substr(0, 2) + ":" + s.substr(2, 2);
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

    onTextChange(e) {
        this.value = this.getValue();
    }


}
