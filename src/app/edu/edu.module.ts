import { Injector, NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModuleHomePage } from "../shared/pages/module-home.page";
import { AuthGuard } from "../shared/services/AuthGuard";
import { MasterLayoutComponent } from "../shared/layouts/master.layout";
import { EduPersonInfoComponent } from './edu-person-info/edu-person-info.component';
import { EduCourseComponent } from './edu-course/edu-course.component';
import { EduCourseListComponent } from './edu-course-list/edu-course-list.component';
import { EduUsercourseComponent } from './edu-usercourse/edu-usercourse.component';
import { CourseComponent } from './edu-usercourse/course/course.component';
import { EduRegedUserListComponent } from './edu-reged-user-list/edu-reged-user-list.component';
import { DynamicFormPage } from "../shared/pages/dform.page";


export const ROUTES: any = [
    {
        path: '',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [             
            { path: 'edu/home', component: ModuleHomePage , data: { code: "edu" }},
            { path: 'edu/edu-person-info', component: EduPersonInfoComponent },
            { path: 'edu/edu-course', component: EduCourseComponent },
            { path: 'edu/edu-course-list', component: EduCourseListComponent },   
            { path: 'edu/edu-course-user', component: EduUsercourseComponent },
            { path: 'edu/edu-user-reged-list', component: EduRegedUserListComponent },
            {
                path: "edu/cmpnycourseprise",
                component: DynamicFormPage,
                data: { code: "FRM-EDU-DYFRM-CMPNY-COURSE-PRICE" }
              },

        ]
    },
];

@NgModule({
    declarations: [
      
    

  
    EduPersonInfoComponent,
                        EduCourseComponent,
                        EduCourseListComponent,
                        EduUsercourseComponent,
                        CourseComponent,
                        EduRegedUserListComponent
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

export class eduModule {
    
}
