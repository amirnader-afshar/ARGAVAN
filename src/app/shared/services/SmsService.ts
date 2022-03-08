import { Injectable, Inject } from '@angular/core';
import { ServiceCaller } from './ServiceCaller';

@Injectable({
    providedIn: 'root',
})
export class SmsService {


    constructor( public service: ServiceCaller,) {
       
            }

    public sendSms(reciverNumbers: string[],smsText: string[]): Promise<boolean> {
        
        return new Promise((resolve, reject) => {
            
            this.service.postPromise('/msg/SmsContext/sendSMS', 
                        { ReciverNumbers: reciverNumbers,Smstexts:smsText }).then(data => {
                              
                                resolve(true);
                            
                        }).catch(() => {
                            resolve(false);
                            
                        });
        });
    }

}
