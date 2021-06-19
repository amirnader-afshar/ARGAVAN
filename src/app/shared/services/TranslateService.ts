import { Injectable } from '@angular/core';
import { ServiceCaller } from './ServiceCaller';
import notify from 'devextreme/ui/notify';




@Injectable()
export class TranslateService {

    data: any;

    constructor(private service: ServiceCaller) {
        if (localStorage.getItem('translate') == null) {
            
            service.get('/SYS/Lang/String/List', (data) => {
                localStorage.setItem('translate', JSON.stringify(Object.entries(data)));
            }, { lang: localStorage.getItem("USER_Defaultlang"), token: localStorage.getItem("token") });
        }
        else {
            this.data = JSON.parse(localStorage.getItem('translate'));
        }
    }

    public Refresh_DIC(Lang: string, refresh: boolean) {
        this.service.get("/SYS/Lang/String/List", (data) => {
            localStorage.setItem("translate", JSON.stringify(Object.entries(data)));            
            if (refresh) {
                if (Lang != localStorage.getItem("USER_Defaultlang"))
                {
                    localStorage.setItem("USER_Defaultlang", Lang);
                    window.location.reload();
                }
                  
            }
            
        }, { lang: Lang, token: localStorage.getItem("token")});
    }



    public instant(key: string): string {
        //console.log("instant");
        //use 0 for object entries
        if (!this.data) {
            notify({
                message: 'لطفا آخرین نسخه را دریافت کنید',
                type: 'error',
                width: 400,
                displayTime: 10000,
                closeOnClick: true,
                closeOnOutsideClick: true
            });
            return key;
        }
        let temp = [];
        // this.data.forEach(element => {
        //     if (element[0] === key)
        //         temp = element;
        // });
        // if (!temp)
        temp = this.data.find(function (element) {
            return element[0] == key;
        })
        if (!temp) {
            temp = this.data.filter(function (element) {
                return element[0] == key;
            }).shift();
        }

        if (temp) {
            return temp[1];
        }

        return key;
        // return this.data[key] || key;
    }
}
