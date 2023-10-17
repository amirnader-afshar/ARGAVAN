import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'jalali-moment';
import { DateTime, DateTimeFormat } from '../util/DateTime';

@Pipe({
    name: 'jalali'
})
export class JalaliPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return DateTime.convertToLocal(value,DateTimeFormat.PersianDate_Revers);
        //  const MomentDate = moment.from(value, 'fa', 'YYYY/DD/MM').format('YYYY/DD/MM');         
        //  return moment(new Date(MomentDate)).locale('fa').format('dddd DD MMMM');
        // let MomentDate = moment(value, 'YYYY/DD/MM');
        // return MomentDate.locale('fa').format('YYYY/M/D');
        
    }
}