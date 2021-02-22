# NgxRbac
----

Roles and rules based access control library for angular version 1.

<!-- * [Initialize Roles](#initializeRole)
* [Setup Rules](#setupRules)
* [Setup Routing](#setupRouting)
* [Check the access](#checkTheAccess) -->
* [Installation](#installation)
* [Tools](#tools)
* [Explanations](#explanations)


## Installation

To install this library, run:

```bash
$ npm install @doce/ngx-rbac --save 
```

 <!--
 ## <a id="initializeRole"></a>Initialize Roles

```ts
// All roles that should be in use in the App
export enum roles {
  unauthorized = '[ROLES] UNAUTHORIZED',
  authorized = '[ROLES] AUTHORIZED',
  moderator = '[ROLES] MODERATOR'
}

// Initialize base role for an unauthorized user  
export const unauthorizedRole: DoRoleType = doCreateRole(roles.unauthorized);
// Initialize common role for authorized 
export const authorizedRole: DoRoleType = doCreateRole(roles.authorized);
// Add all permissions that have a user with the unauthorized user role to the authorized
authorizedRole.addPermissionsOf(unauthorizedRole);
// Initialize the most privileged role for the moderator  
export const moderatorRole: DoRoleType = doCreateRole(roles.moderator);
// Add all permissions that have a user with the authorized user role to the moderator
moderatorRole.addPermissionsOf(authorizedRole);
```

## <a id="setupRules"></a>Setup Rules

```ts
import { roles } from './roles.ts'

// The rules, that will be used in the App
export const enum rules {
  isUnauthorized = '[RULES] IS_UNAUTHORIZED', // check is user is unauthorized 
  isAuthorized = '[RULES] IS_AUTHORIZED',     // check is user is authorized
  isModerator = '[RULES] IS_MODERATOR',       // check is user is moderator
}

// Define the conditions by the witch the rules will be checks   
export const ruleSet = doCreateRuleSet({
  [rules.isUnauthorized]: [
    roles.unauthorized, 
    doNot(roles.authorized), 
    doNot(roles.moderator)
],                                       // The Rule only for users with unauthorized Role
  [rules.isAuthorized]: [roles.authorized, doNot(roles.moderator)], // The Rule only for users with authorized Role
  [rules.isModerator]: [roles.moderator] // The Rule only for users with moderator Role
})
```

```ts
import { DoGlobalRulesService } from '?'
import { ruleSet } from './ruleSet.ts'

export class AppComponent {
  constructor(private readonly doGlobalRulesService: DoGlobalRulesService) {
    doGlobalRulesService.addGlobalRules(ruleSet); // Add global Rules to the pull of global rules  
  }
}
```

## <a id="setupRouting"></a>Setup Routing

```ts
const routes: Routes = [
  {
    path: '',
    component: AppComponent
    children: [
      {
        path: 'singUpPath',
        data: {
          rules: [rules.isUnauthorized]
        },
        canActivate: [DoCanGuard],
        component: SingUpComponent
      },
      {
        path: 'singInPath',
         data: {
          rules: [rules.isUnauthorized]
        },
        canActivate: [DoCanGuard],
        component: SingInComponent
      },
      {
        path: 'userHomePagePath/:userId',
         data: {
          rules: [rules.isAuthorized]
        },
        canActivate: [DoCanGuard],
        component: UserHomePageComponent
      },
      {
        path: 'CMSPagePath',
         data: {
          rules: [rules.isModerator]
        },
        canActivate: [DoCanGuard],
        component: CMSPageComponent
      }
    ]
  }
]
```

## <a id="checkTheAccess"></a>Check the access


```html
<user-card>
  <h2>{{user.name}}</h2>
  <a href="" [doCan]="CAN_EDIT">Edit</a>
</user-card>
```
-->

## Tools
### Component

```html 
<do-provide-rules></do-provide-rules>
```

| Properties | Type | Description |
| --- | --- | --- |
| rules | [DoStringDictionary](#DoStringDictionary)\<[DoRuleType](#DoRuleType)> \| [DoRuleType](#DoRuleType) | *Input a rules here to provide them on the current level* |
| roles | [DoRuleType](#DoRuleType)[] | *Input a roles here to provide them on the current level* |

### Guard

```ts
DoCanGuard
```

| Arguments | Type | Description |
| --- | --- | --- |
| rules | string[] | *The array of rule names* |


### Pipe

`doCan`

| Arguments | Type | Description |
| --- | --- | --- |
| rules | string \| [AllPossibleCheckers](#AllPossibleCheckers)[] \| [AllPossibleCheckers](#AllPossibleCheckers) \| [DoRuleType](#DoRuleType) | *Test criteria* |


### Functions

#### For Roles:

- **doCreateRole**(*name: string*): *[DoRoleType](#DoRoleType)*

#### For Permissions:

- **doCreatePermission**(*name: string*): *[DoRolePermissionType](#DoRolePermissionType)*
- **doCreatePermissions**(*names: string[]*): *[DoRolePermissionType](#DoRolePermissionType)[]*
#### For Rules: 

- **doCreateRuleSet**(*ruleSet: [DoRuleSet](#DoRuleSet), options?: [DoRuleOptions](#DoRuleOptions)*): *[DoStringDictionary](#DoStringDictionary)\<[DoRule](#DoRule)\>*

- <a id="doCreateRule"></a>**doCreateRule**(*name: string, checkers: [AllPossibleCheckers](#AllPossibleCheckers)[], options?:[DoRuleOptions](#DoRuleOptions)*): *[DoRuleType](#DoRuleType)*

- **doExtendRule**(*name: string,  checkers: [AllPossibleCheckers](#AllPossibleCheckers)[]*): *[DoStringDictionary](#DoStringDictionary)\<[DoRule](#DoRule)\>*

- **doSimpleRule**(*name: string, options?:[DoRuleOptions](#DoRuleOptions)*): *{ [name]: [doCreateRule](#doCreateRule)(name, [() => true], options) }*

#### Logical:

- **doNot**(*checkers: [AllPossibleCheckers](#AllPossibleCheckers), options: [DoRuleOptions](#DoRuleOptions)*): *[DoRuleType](#DoRuleType)*

- **doOr**(*checkers: [AllPossibleCheckers](#AllPossibleCheckers), options: [DoRuleOptions](#DoRuleOptions)*): *[DoRuleType](#DoRuleType)*

- **doAnd**(*checkers:  [AllPossibleCheckers](#AllPossibleCheckers), options: [DoRuleOptions](#DoRuleOptions)*): *[DoRuleType](#DoRuleType)*

## Explanations
----
### <a id="AllPossibleCheckers"></a>AllPossibleCheckers
```ts
DoRuleType | DoRoleType | DoCheckerFunction | string;
```

### <a id="DoRuleSet"></a>DoRuleSet
```ts
{
    [ruleName: string]: AllPossibleCheckers[]
}
```

### <a id="DoRuleOptions"></a>DoRuleOptions
```ts
{
  absentRuleBehavior?: DoAbsentRuleBehavior;
  groupName?: string;
}
```

### <a id="DoCheckerFunction"></a>DoCheckerFunction
```ts
(args: any[], dependency: Dependency) => boolean
```

### <a id="Dependency"></a>Dependency
```ts
[DoRoleType[], DoStringDictionary<DoRuleType>]
```

### <a id="DoRuleType"></a>DoRuleType
```ts
{
    addPermissionsOf(child: DoRolePermissionType): void;
    addRule(rule: DoRuleType | DoStringDictionary<DoRuleType>): void;
}
```


### <a id="DoStringDictionary"></a>DoStringDictionary\<T>
```ts
{
    [key: string]: T;
}
```

### <a id="DoRolePermissionType"></a>DoRolePermissionType
```ts
{
    can: DoStringDictionary<DoRuleType>;
    canNames: string[];
    name: string;
}
```

