import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { isDate } from 'util';
import { Injectable } from '@angular/core';

@Injectable()
export class SunDateNativeAdapter  extends NgbDateAdapter<Date> {
    public fromModel(date: Date | null): NgbDateStruct | null {
        return isDate(date) ?
            { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
            : null;
    }

    public toModel(date: NgbDateStruct | null): Date | null {
        return date !== null && date.year !== null && date.month !== null
            ? new Date(Date.UTC(date.year, date.month - 1, date.day))
            : null;
    }
}