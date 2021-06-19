# Router guard permission

## AuthGuard

You can use ```AuthGuard``` from ```Permission``` module, protecting routes.
this flowing example all permission except ```GuestUser``` can access to ```users``` path.
whene ```GuestUser``` asked ```user``` path, redirect to ```403```.

```typescript
import { IPermissionGuardModel } from '.../services/permission';
import { AuthGuard } from '.../services/permission/AuthGuard';

const routes: Routes = [
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: {
            Permission: {
                Except: ['GuestUser'],
                RedirectTo: '403'
            } as IPermissionGuardModel
        },
        children: []
    },
    {
        path: 'users/create',
        component: UserCreateComponent,
        canActivate: [AuthGuard],
        data: {
            Permission: {
                Only: ['CreateUser'],
                RedirectTo: '403'
            } as IPermissionGuardModel
        },
        children: []
    },
    {
        path: '403',
        component: AccessDeniedComponent,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

```