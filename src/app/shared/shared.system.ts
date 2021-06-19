import { NgModule } from '@angular/core';
import { MasterLayoutComponent } from "./layouts/master.layout";
import { AuthGuard } from './services/AuthGuard';

// import your pages here
// import { BFSVocherPage } from '../bfs/vocher/vocher.page';
//import { WAMSerialPopupPage } from '../wam/movement/serial.popup';


// route your pages here

export const ROUTES: any = [
  {
    path: '',
    component: MasterLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [

      // { path: 'bfs/vocher/vocher', component: BFSVocherPage },
      // { path: 'wam/movement/serial', component: WAMSerialPopupPage },

    ]
  },

];

// declare your pages here

@NgModule({
  declarations: [
    // BFSVocherPage,
    // WAMSerialPopupPage,

  ],
  imports: [

  ],
  providers: [
    
  ],
  exports: [

  ]
})

export class SystemSharedModule {

}
