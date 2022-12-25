import { Injector, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
//
import { DynamicFormPage } from "../shared/pages/dform.page";
import { ModuleHomePage } from "../shared/pages/module-home.page";
import { AuthGuard } from "../shared/services/AuthGuard";
import { MasterLayoutComponent } from "../shared/layouts/master.layout";
//
import { ADMUsersPage } from "./security/user/users.page";
import { ADMEditUserPage } from "./security/user/user.page";
import { ADMEditCompanyPage } from "./setup/company/company.page";
import { ADMCopmaniesPage } from "./setup/company/companies.page";
import { ADMDynamicFormsPage } from "./setup/dynamicforms.page";
import { ADMDynamicFormItemsPage } from "./setup/dynamicformitems.page";
import { ADMEnumsPage } from "./setup/enums.page";
import { ADMEnumItemsPage } from "./setup/enum.page";
import { ADMSubjectsPage } from "./setup/subjects.page";
import { ADMPrivilegesPage } from "./setup/privileges.page";
import { ADMGroupsSecurityPage } from "./security/user/group.page";
import { ADMMultiOrganizationPage } from "./setup/multiorganization/multiorganization.page";
import { ADMConfigDefinition } from "./setup/configdefinition.page";

import { ADMProfilePage } from "./security/user/profile.page";
import { ADMPrivilegePopupPage } from './security/user/privileges.popup';
import { ADMTablesPage } from "./setup/tables.page";
import { ADMLogsPage } from "./security/logs.page";
import { ADMPrivilegeComponent } from "./setup/privilages.component";
import { ADMReportFormsPage } from "./setup/reportforms.page";
import { ADMReportParameterFormsPage } from "./setup/reportparameterforms.page";
import { ADMSubjectValuesPage } from "./setup/subject-values.popup";


export const ROUTES: any = [
  {
    path: "",
    component: MasterLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
   
    children: [
      // ADM Module
      { path: "adm/home", component: ModuleHomePage, data: { code: "ADM" } },
      { path: "adm/sec/users", component: ADMUsersPage },
      { path: "adm/sec/user/edit", component: ADMEditUserPage },
      { path: "adm/sec/logs", component: ADMLogsPage },
      { path: "user/profile", component: ADMProfilePage },
      {
        path: "adm/sec/privileges",
        component: ADMPrivilegesPage,
        data: { mode: "1" }
      },
      {
        path: "adm/sec/groups",
        component: ADMGroupsSecurityPage,
        data: { mode: "1" }
      },

      // STP Module
      { path: "stp/home", component: ModuleHomePage, data: { code: "STP" } },
      { path: "stp/forms", component: ADMDynamicFormsPage },
      { path: "stp/forms/edit", component: ADMDynamicFormItemsPage },
      { path: "stp/enums", component: ADMEnumsPage },
      { path: "stp/enums/edit", component: ADMEnumItemsPage },
      { path: "stp/reports", component: ADMReportFormsPage },
      { path: "stp/reports/edit", component: ADMReportParameterFormsPage },
      {
        path: "stp/dictionary",
        component: DynamicFormPage,
        data: { code: "FRM-ADM-003" }
      },
      {
        path: "stp/pup_priority",
        component: DynamicFormPage,
        data: { code: "FRM-PUB-PRIORITY" }
      },
      { path: "stp/configs", component: ADMConfigDefinition },
      { path: "stp/subjects", component: ADMSubjectsPage },
      {
        path: "stp/privileges",
        component: ADMPrivilegesPage,
        data: { mode: "2" }
      },
      {
        path: "stp/groups",
        component: ADMGroupsSecurityPage,
        data: { mode: "2" }
      },
      {
        path: "stp/tables",
        component: ADMTablesPage
      },
      {
        path: "stp/tabels/privilages",
        component: ADMMultiOrganizationPage
      },
      { path: "stp/companies", component: ADMCopmaniesPage },
      { path: "stp/companies/edit", component: ADMEditCompanyPage },
    ]
  }
];

@NgModule({
  declarations: [
    ADMUsersPage,
    ADMProfilePage,
    ADMEditUserPage,
    ADMCopmaniesPage,
    ADMEditCompanyPage,
    ADMDynamicFormsPage,
    ADMDynamicFormItemsPage,
    ADMEnumsPage,
    ADMEnumItemsPage,
    ADMSubjectsPage,
    ADMSubjectValuesPage,
    ADMPrivilegesPage,
    ADMGroupsSecurityPage,
    ADMMultiOrganizationPage,
    ADMConfigDefinition,
    ADMPrivilegePopupPage,
    ADMPrivilegeComponent,
    ADMTablesPage,
    ADMLogsPage,
    ADMReportFormsPage,
    ADMReportParameterFormsPage
  ],
  entryComponents: [
    ADMPrivilegePopupPage,
    ADMSubjectValuesPage
  ],
  imports: [CommonModule, SharedModule.forRoot(), RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ADMModule { }
