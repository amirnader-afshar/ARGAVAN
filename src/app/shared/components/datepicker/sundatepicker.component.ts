import { Component, Input, Output, EventEmitter, Injectable, forwardRef, ViewChild } from '@angular/core';
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbCalendarPersian, NgbCalendarGregorian, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const Jalali_WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const Jalali_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) { return Jalali_WEEKDAYS_SHORT[weekday - 1]; }
  getMonthShortName(month: number) { return Jalali_MONTHS[month - 1]; }
  getMonthFullName(month: number) { return Jalali_MONTHS[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}

const Gregorian_weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const Gregorian_months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc']

@Injectable()
export class NgbDatepickerI18nGregorian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) { return Gregorian_weekdays[weekday - 1]; }
  getMonthShortName(month: number) { return Gregorian_months[month - 1]; }
  getMonthFullName(month: number) { return Gregorian_months[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}

const Calender_Type: string = localStorage.getItem('Calender_Type');
@Component({
  selector: "sun_datepicker",
  templateUrl: "./sundatepicker.component.html",
  providers: [
    {
      provide: NgbCalendar, useClass: (Calender_Type === 'Jalali') ? NgbCalendarPersian :
        (Calender_Type === 'Gregorian') ? NgbCalendarGregorian : NgbCalendarGregorian
    },
    {
      provide: NgbDatepickerI18n, useClass: Calender_Type === 'Jalali' ? NgbDatepickerI18nPersian :
        Calender_Type === 'Gregorian' ? NgbDatepickerI18nGregorian : NgbDatepickerI18nGregorian
    }
    , {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SunDatepickerComponent),
      multi: true
    }, NgbDatepickerConfig
  ]
})
export class SunDatepickerComponent implements ControlValueAccessor {

  model: any;
  today = this.calendar.getToday();
  placement = 'bottom';
  disabled = false;
  @ViewChild('d2', { static: true }) d2: NgbInputDatepicker;

  @Input() readOnly: boolean = false;

  @Input() fromNow: boolean = false;

  @Input() minimumDate: string;
  @Input() maximumDate: string;

  @Output() valueChange: EventEmitter<any>;

  // Function to call when the date changes.
  onChange = (date?: any) => { };

  // Function to call when the date picker is touched
  onTouched = () => { };

  writeValue(value: Date) {

    if (!value) { return; }
    let dd;
    if (Calender_Type === 'Jalali') {

      let jm = this.GregorianToJalali(value);
      dd = new Date(jm);
    }
    else if (Calender_Type === 'Gregorian') {
      dd = new Date(value);
    }
    this.model = {
      year: dd.getFullYear(),
      month: dd.getMonth() + 1,
      day: dd.getDate()
    };

  }

  registerOnChange(fn: (date: any) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Write change back to parent
  onDateChange(value: Date) {
    console.log('onDateChange', this.model);

    const _date = (Calender_Type === 'Jalali') ? this.JalaliToGregorian(this.model.year + '-' + this.model.month + '-' + this.model.day)
      : value;
    this.onChange(_date);
  }

  // Write change back to parent
  onDateSelect(value: any) {

    const _date = (Calender_Type === 'Jalali') ? this.JalaliToGregorian(value.year + '-' + value.month + '-' + value.day)
      : value.year + '-' + value.month + '-' + value.day;

    this.onChange(_date);
  }

  today_click() {
    this.model = this.today;
    this.onDateSelect(this.today);
    this.d2.close();
  }

  constructor(private config: NgbDatepickerConfig, private parserFormatter: NgbDateParserFormatter, private calendar: NgbCalendar) {
    this.valueChange = new EventEmitter<any>();
    this.config.firstDayOfWeek = Calender_Type === 'Jalali' ? 6 : 1;
  }
  ngOnInit() {


    console.log('ngOnInit', this.maximumDate);

    let maxD, minD;
    if (Calender_Type === 'Jalali') {
      let jm = this.GregorianToJalali(this.maximumDate);
      maxD = new Date(jm);
      jm = this.GregorianToJalali(this.minimumDate);
      minD = new Date(jm);
    }
    else if (Calender_Type === 'Gregorian') {
      maxD = new Date(this.maximumDate);
      minD = new Date(this.minimumDate);
    }

    if (this.maximumDate) {
      this.config.maxDate = {
        year: maxD.getFullYear(),
        month: maxD.getMonth() + 1,
        day: maxD.getDate()
      };
    }

    if (this.minimumDate) {
      this.config.minDate = {
        year: minD.getFullYear(),
        month: minD.getMonth() + 1,
        day: minD.getDate()
      };
    }

    if (this.fromNow) {
      if (Calender_Type === 'Jalali') {
        const jm = moment().locale('fa').format('YYYY/MM/DD');
        minD = new Date(jm);
      }
      else if (Calender_Type === 'Gregorian') {
        minD = new Date();
      }
      this.config.minDate = {
        year: minD.getFullYear(),
        month: minD.getMonth() + 1,
        day: minD.getDate()
      };
    }

    console.log('ngOnInit', this.minimumDate);

  }

  GregorianToJalali(GDate) {
    return moment(new Date(GDate)).locale('fa').format('YYYY/MM/DD');
  }

  JalaliToGregorian(JDate) {
    return moment.from(JDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
  }



}
