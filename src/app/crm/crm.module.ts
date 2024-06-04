import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmInvoiceComponent } from './crm-invoice/crm-invoice.component';
import { ModuleHomePage } from '../shared/pages/module-home.page';
import { MasterLayoutComponent } from '../shared/layouts/master.layout';
import { AuthGuard } from '../shared/services/AuthGuard';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InvoiceDComponent } from './crm-invoice/invoice-d/invoice-d.component';
import { InvoiceListComponent } from './crm-invoice/invoice-list/invoice-list.component';


export const ROUTES: any = [
  {
      path: '',
      component: MasterLayoutComponent,
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      children: [
           
          { path: 'crm/home', component: ModuleHomePage , data: { code: "crm" }},
          { path: 'crm/invoiceList', component: InvoiceListComponent ,data:{datatouse:'somting'}},
          { path: 'crm/invoice', component: CrmInvoiceComponent ,data:{datatouse:'somting'}},           
          { path: 'crm/invoiceD', component: InvoiceDComponent ,data:{datatouse:'somting'}},
      ]
  },
];


@NgModule({
  declarations: [

  
    CrmInvoiceComponent,
        InvoiceDComponent,
        InvoiceListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    FormsModule,
    // CKEditorModule,
    RouterModule.forChild(ROUTES),
  ],
  exports: [
      RouterModule
  ] 
})
export class CrmModule { }
