import { Injector, NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModuleHomePage } from "../shared/pages/module-home.page";
import { AuthGuard } from "../shared/services/AuthGuard";
import { MasterLayoutComponent } from "../shared/layouts/master.layout";
import { DynamicFormPage } from "../shared/pages/dform.page";
import { FishReportComponent } from './fish-report/fish-report.component';

////حقوق و دسمتزد رهنمون 

export const ROUTES: any = [
    {
        path: '',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [             
            { path: 'reim/home', component: ModuleHomePage , data: { code: "reim" }},
            { path: 'reim/fish', component: FishReportComponent }, 

        ]
    },
];

@NgModule({
    declarations: [
      

  
    FishReportComponent
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

export class reimModule {
    
}
