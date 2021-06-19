import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'jalali-moment';

@Pipe({
    name: 'jalali'
})
export class JalaliPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        const MomentDate = moment.from(value, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
        return moment(new Date(MomentDate)).locale('fa').format('dddd DD MMMM');
        // const MomentDate = moment(value, 'YYYY/MM/DD');
        // return MomentDate.locale('fa').format('YYYY/M/D');
    }
}