import { NgModule } from '@angular/core';
import { HasPermissionDirective } from '../directives/has-permission.directive';
import { ExceptPermissionDirective } from '../directives/except-permission.directive';
import { PermissionService } from '../services/permission.service';
import { PermissionHelper } from '../services/permission-helper.service';

@NgModule({
    declarations: [HasPermissionDirective, ExceptPermissionDirective],
    imports: [],
    exports: [HasPermissionDirective, ExceptPermissionDirective],
    providers: [PermissionService, PermissionHelper],
})
export class Permission { }