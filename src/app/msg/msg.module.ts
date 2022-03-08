import { Injector, NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModuleHomePage } from "../shared/pages/module-home.page";
import { AuthGuard } from "../shared/services/AuthGuard";
import { MasterLayoutComponent } from "../shared/layouts/master.layout";
import { MessageComponent } from './message/message.component';
import { MessageListComponent } from './message-list/message-list.component';
import { CmpnyReciverComponent } from './cmpny-reciver/cmpny-reciver.component';
import { MsgSendSmsComponent } from './msg-send-sms/msg-send-sms.component';
import { DynamicFormPage } from "../shared/pages/dform.page";
import { MsgSmsListComponent } from './msg-sms-list/msg-sms-list.component';


export const ROUTES: any = [
    {
        path: '',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [             
            { path: 'msg/home', component: ModuleHomePage , data: { code: "msg" }},
            { path: 'msg/msgs', component: MessageComponent },
            { path: 'msg/out-msg-list', component: MessageListComponent, data:{MSG_IN_OUT_TYPE:'out'}},
            { path: 'msg/in-msg-list', component: MessageListComponent, data:{MSG_IN_OUT_TYPE:'in'}},
            { path: 'msg/msg-cmpny-reciver', component: CmpnyReciverComponent}  ,
            { path: 'msg/send-sms', component: MsgSendSmsComponent} ,
            { path: 'msg/sms-list', component: MsgSmsListComponent} ,
            {
                path: "msg/msg-sms-template",
                component: DynamicFormPage,
                data: { code: "FRM-MSG-SMS-TEMPLATE" }
              }                   
        ]
    },
];

@NgModule({
    declarations: [
      
    
    MessageComponent,
                  MessageListComponent,
                  CmpnyReciverComponent,
                  MsgSendSmsComponent,
                  MsgSmsListComponent
  ],
    imports: [
        CommonModule,
        SharedModule.forRoot(),
        FormsModule,
        NgxExtendedPdfViewerModule ,
        // CKEditorModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [
        RouterModule
    ] 
})

export class msgModule {
    
}
