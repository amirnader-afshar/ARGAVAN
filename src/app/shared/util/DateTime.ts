import { Mds } from 'mds.persian.datetime'
import PersianDateTime = Mds.PersianDateTime;
import * as moment from 'jalali-moment';

export enum DateTimeFormat {
  PersianDate,
  PersianDateTime,
  DateTime,
  Date,
  Time
}

export class DateTime {
  static get now(): string {
    let now = PersianDateTime.now;
    now.englishNumber = true;
    return now.toString("yyyy-MM-dd");
  }

  static convertFormat(format) {
    switch (format) {
      case DateTimeFormat.Date:
        return 'YYYY/MM/DD';
      case DateTimeFormat.DateTime:
        return 'YYYY/MM/DD HH:mm:ss';
      case DateTimeFormat.PersianDate:
        return 'jYYYY/jMM/jDD';
      case DateTimeFormat.PersianDateTime:
        return 'jYYYY/jMM/jDD HH:mm';
      case DateTimeFormat.Time:
        return 'HH:mm';
    }
  }

  static convertToLocal(date, format: DateTimeFormat = DateTimeFormat.PersianDate) {
    try {
      if (date) {
        if (format == DateTimeFormat.Time) {
          if (typeof date === "number") {
            return DateTime.convertTime(date);
          }
        }
        let formatStr: string = this.convertFormat(format);
        let convert;
        if (format === DateTimeFormat.DateTime) {
          convert = moment(date.toLocaleString(), this.convertFormat(DateTimeFormat.DateTime));
          convert.hour(convert.hours());
          convert.minute(convert.minutes());
          convert.second(convert.seconds());
        } else {
          convert = moment(date.toLocaleString());
        }
        return convert.clone().locale('fa').format(formatStr);

        // // let convertPersian = moment(JSON.parse(JSON.stringify(date)), DateTime.convertFormat(DateTimeFormat.PersianDateTime));
        // //TODO: Read culture
        // // if ((convert.year() < convertPersian.year()) && (convert.year() > 2000))
        // else
        //     return JSON.parse(JSON.stringify(date));
      }
      return null;
    } catch (e) {
      //  
      return null;
    }

  }

  static convertTime(num: number) {

    if (num === null)
      return null;
    let s = num + "";
    while (s.length < 4) s = "0" + s;
    return s.substr(0, 2) + ":" + s.substr(2, 2);
  }

  static convertForRemote(date): string {
    if (date) {
      let convert = moment(date.toLocaleString(), DateTime.convertFormat(DateTimeFormat.PersianDateTime));
      //TODO: Read culture
      return DateTime.convertToIso(convert.toDate(), );
    }
    return null;
  }


  static convertToIso(dt: Date) {
    let dd: any = dt.getDate();
    let MM: any = dt.getMonth() + 1;
    let yyyy = dt.getFullYear();
    let HH: any = dt.getHours();
    let mm: any = dt.getMinutes();
    let ss: any = dt.getSeconds();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (MM < 10) {
      MM = '0' + MM;
    }
    if (HH < 10) {
      HH = '0' + HH;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    if (ss < 10) {
      ss = '0' + ss;
    }
    return yyyy + "-" + MM + "-" + dd + "T" + HH + ":" + mm + ":" + ss;// + ".000Z"
  }
}

