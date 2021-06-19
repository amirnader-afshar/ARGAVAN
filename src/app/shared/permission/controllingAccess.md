﻿# Controlling access in views

## Overview
* [Permission directive](#permission-directive)
* [Basic usage](#basic-usage)
* [Custom behaviour](#custom-behaviour)

## Permission directive

Permission module exposes directive that can show/hide elements of your application based on set of permissions.

| Attribute                    | Value                  | Description                                                       | 
| :--------------------------- | :--------------------- | :---------------------------------------------------------------- |
| `hasPermission`              | [`Array`]              | Permissions allowed to access content                             |
| `exceptPermission`           | [`Array`]              | permissions denied to access content                              |
| `onAuthorizedPermission`     | [`String`\|`Function`] | PermissionStrategies or Custom function invoked when authorized   |
| `onUnauthorizedPermission`   | [`String`\|`Function`] | PermissionStrategies or Custom function invoked when unauthorized |

## Basic usage

```html
<button type="button" class="btn btn-danger btn-xs" [hasPermission]="['DeleteUser']">
  <span class="fa fa-trash" aria-hidden="true"></span>
  Delete
</button>
```

Or set of permissions separated by 'coma':

```html
<button type="button" class="btn btn-danger btn-xs" [hasPermission]="['DeleteUser', 'EditUser']">
  <span class="fa fa-trash" aria-hidden="true"></span>
  Delete
</button>
```
or this example all user access except 'GuestUser':

```html
<button type="button" class="btn btn-danger btn-xs" [exceptPermission]="['GuestUser']">
  <span class="fa fa-trash" aria-hidden="true"></span>
  Delete
</button>
```

## Custom behaviour
By default hasPermission or exceptPermission directive is manipulating style DOM elements by adding or removing display ```none``` or ```inherit```.
But Permission module exposes additional strategies or even custom function allowing to customize the way elements are being rendered or decorated.

To use different strategy pass it as value to ```onAuthorizedPermission``` and ```onUnauthorizedPermission``` params:

| Value       | Behaviour                                       |
| :---------- | :---------------------                          |
| `enable`    | Removes ```disabled``` attribute from element   |
| `disable`   | Adds ```disabled``` attribute to element        |
| `show`      | set ```display``` style to ```inherit```        |
| `hide`      | set ```display``` style to ```none```           |

```html
<button type="button" class="btn btn-danger btn-xs" 
  [hasPermission]="['GuestUser']"
  onAuthorizedPermission="enable"
  onUnauthorizedPermission="disable">
  <span class="fa fa-trash" aria-hidden="true"></span>
  Delete
</button>
```

Or you can provide custom function defined inside component or link function that will be invoked based on authorization results:

```typescript
@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  constructor() { }

  OnAuthorizedPermission(element: ElementRef) {
    element.nativeElement.style.visibility ="inherit";
  }

  OnUnauthorizedPermission(element: ElementRef) {
    element.nativeElement.style.visibility = "hidden";    
  }
}
```
And then passed in view to permission attributes:

```html
<button
  class="btn btn-primary btn-sm pull-right"
  [hasPermission]="['CreateUser']"
  [onAuthorizedPermission]="OnAuthorizedPermission"
  [onUnauthorizedPermission]="OnUnauthorizedPermission">
  <span class="fa fa-plus" aria-hidden="true"></span>
  Add New User
</button>
```
