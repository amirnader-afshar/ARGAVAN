import { Injectable } from '@angular/core';
import { ServiceCaller } from './ServiceCaller';
import { Dialog, Notify } from '../util/Dialog';
import { TranslateService } from './TranslateService';




@Injectable()
export class HistoryService {

    dataToPostBody: any = {};

    constructor(public translate: TranslateService, private service: ServiceCaller) {

    }



    public getHistory(Sp_Name: string, Field_Name: string, Field_Value): any {
        this.dataToPostBody = {
            'Data': {
                'SPName': '[adm].[Adm_Sp_Sun_Log_Action_Select]', //اس پی تاریچه سند
                'Data_Input': {
                    'Mode': 1,
                    'Header': { 'Field_Name': Field_Name, 'Field_Value': Field_Value, 'Sp_Name': Sp_Name },
                    'Detail': ''
                }
            }
        };
        var headerDetail = [];
        return this.service.post('/BFS/AccountAssignType/test', (data) => {
            console.log('data of history', data)

            if (data.ReturnData.Data_Output[0].Header) {
                return data.ReturnData.Data_Output[0].Header;
                // data.ReturnData.Data_Output[0].Header.forEach(item => {
                //     // headerDetail.push(item.data.Data_Output[0].Header[0])
                //     var a = {};
                //     a = item.Log_Json_Data.Data_Output[0].Header[0];
                //     Object.assign(a, { id: Math.random() })
                //     headerDetail.push(a)
                // });

                // if (headerDetail != []) {
                //     console.log('headerDetailheaderDetailheaderDetail', headerDetail);
                //     return headerDetail;
                // }
            } else {
                Dialog.error(this.translate.instant('PUB_History'), this.translate.instant('PUB_No_History'));
                return null;
            }
        }, this.dataToPostBody, (data) => {
            Notify.error(data.ReturnData.Data_Output[0].Response_Text);
        })
    }
}
