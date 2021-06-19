export class Formatter
{
    date(cellInfo) {
        if (cellInfo.value == null || cellInfo.value == "")
            return null;
        return new String(cellInfo.value).split(' ')[0];
    }
    time(cellInfo) {
        if (cellInfo.value == null || cellInfo.value == "")
            return null;
        return new String(cellInfo.value).split(' ')[1];
    }

    timeOnly(cellInfo) {
        if (cellInfo.value == null || cellInfo.value == "")
            return null;
        let s = cellInfo.value + "";
        while (s.length < 4) s = "0" + s;
        return new String(s).substr(0, 2) + ':' + String(s).substr(2, 2);
    }
     
}
