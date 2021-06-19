import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouteData } from './RouteData';
import { RouteDataConfig } from './RouteDataConfig';


@NgModule({
    imports: [CommonModule],
    declarations: [],
    exports: [],
    providers: [RouteData]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: RouteDataConfig): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                { provide: RouteDataConfig, useValue: config }
            ]
        };
    }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/