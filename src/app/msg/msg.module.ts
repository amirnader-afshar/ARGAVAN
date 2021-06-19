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


export const ROUTES: any = [
    {
        path: '',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [             
            { path: 'msg/home', component: ModuleHomePage , data: { code: "msg" }},
            { path: 'msg/msgs', component: MessageComponent }
            
        ]
    },
];

@NgModule({
    declarations: [
      
    
    MessageComponent
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
