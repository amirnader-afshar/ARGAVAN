import { Injector, NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


import { SharedModule } from '../shared/shared.module';
// import {CKEditorModule} from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { DynamicFormPage } from "../shared/pages/dform.page";
import { ModuleHomePage } from "../shared/pages/module-home.page";
import { AuthGuard } from "../shared/services/AuthGuard";
import { MasterLayoutComponent } from "../shared/layouts/master.layout";

import { ReportPage } from "../shared/report/report.page";
import { outLettercomponent } from './outLetter/outLettercomponent';
import { OutLettersComponent } from './outLetter/out-letters.component';
import { LetterNoteComponent } from './letter-note/letter-note.component';
import { LetterNoteListComponent } from './letter-note-list/letter-note-list.component';
import { HomeComponent } from './home/home.component';
import { LettrtErjaatComponent } from './lettrt-erjaat/lettrt-erjaat.component';
import { HistoryComponent } from "../shared/components/history/history.component";
import { LetterErjataGraphComponent } from './lettrt-erjaat/letter-erjata-graph/letter-erjata-graph.component';
import { CmpnyReciverComponent } from './cmpny-reciver/cmpny-reciver.component';
import { DocumenteEditorComponent } from './outLetter/documente-editor/documente-editor.component';
import { LetterTemplateComponent } from './letter-template/letter-template.component';
import { LettetTemplateListComponent } from "./letter-template/lettet-template-list/lettet-template-list.component";
import { CategoryComponent } from './category/category.component';
import { ReciverComponent } from './reciver/reciver.component';

 

export const ROUTES: any = [
    {
        path: '',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
             
            { path: 'ofa/home', component: ModuleHomePage , data: { code: "ofa" }},
            { path: 'ofa/outLetters', component: OutLettersComponent ,data:{LETTER_IN_OUT_TYPE:'out'}}, 
            { path: 'ofa/enternal_letters', component: OutLettersComponent ,data:{LETTER_IN_OUT_TYPE:'in',FLG_ENTERNAL:true}},
            { path: 'ofa/outLetters_archive', component: OutLettersComponent ,data:{LETTER_IN_OUT_TYPE:'out',archive:true}}, 
            { path: 'ofa/outLetter', component: outLettercomponent ,data:{LETTER_IN_OUT_TYPE:'out'}},
            { path: 'ofa/inLetters', component: OutLettersComponent ,data:{LETTER_IN_OUT_TYPE:'in'}}, 
            { path: 'ofa/inLetters_archive', component: OutLettersComponent ,data:{LETTER_IN_OUT_TYPE:'in',archive:true}},
            { path: 'ofa/inLetter', component: outLettercomponent ,data:{LETTER_IN_OUT_TYPE:'in'}},
            { path: 'ofa/letterNote', component: LetterNoteComponent },
            { path: 'ofa/letterNoteList', component: LetterNoteListComponent },
            { path: 'ofa/letterErjaat', component: LettrtErjaatComponent },
            { path: 'ofa/letterErjaatGraph', component: LetterErjataGraphComponent },
            { path: 'ofa/bookSetting', component: DynamicFormPage, data: { code: 'ofa_Frm_book_setting' } },                                      
            { path: 'ofa/letterHistory', component: HistoryComponent },
            { path: 'ofa/ofa-cmpny-reciver', component: CmpnyReciverComponent },
            { path: 'ofa/ofa-letter-template-list', component: LettetTemplateListComponent },
            { path: 'ofa/ofa-letter-template', component: LetterTemplateComponent },
            { path: 'ofa/ofa-category', component: CategoryComponent },
            { path: 'ofa/ofa-reciver', component: ReciverComponent },
            
        ]
    },
];

@NgModule({
    declarations: [
        outLettercomponent,
        OutLettersComponent,
        LetterNoteComponent,
        LetterNoteListComponent,
        HomeComponent,
        LettrtErjaatComponent,
        LetterErjataGraphComponent,
        CmpnyReciverComponent,
        DocumenteEditorComponent,
        LetterTemplateComponent,
        LettetTemplateListComponent,
        CategoryComponent,
        ReciverComponent,        
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

export class ofaModule {
    
}
