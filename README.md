# NgxRbac
----


## Example use

### <a id="initializeRole"></a>Initialize Roles

```ts
const enum roles {
  unauthorized = '[ROLES] UNAUTHORIZED',
  authorized = '[ROLES] AUTHORIZED',
  moderator = '[ROLES] MODERATOR'
}

export const unauthorizedRole: DoRoleType = doCreateRole(roles.unauthorized);
export const authorizedRole: DoRoleType = doCreateRole(roles.authorized);
authorizedRole.addPermissionsOf(unauthorizedRole);
export const moderatorRole: DoRoleType = doCreateRole(roles.moderator);
moderatorRole.addPermissionsOf(authorizedRole);
```

### <a id="setupRules"></a>Setup Rules

```ts
const enum rules {
  isUnauthorized = '[RULES] IS_UNAUTHORIZED',
  isAuthorized = '[RULES] IS_AUTHORIZED',
  isModerator = '[RULES] IS_MODERATOR',
}

export const ruleSet = doCreateRuleSet({
  [rules.isUnauthorized]: [roles.unauthorized, doNot(roles.authorized), doNot(roles.moderator)],
  [rules.isAuthorized]: [roles.authorized, doNot(roles.moderator)],
  [rules.isModerator]: [roles.moderator]
})
```

```ts
export class AppComponent {
  constructor(public doGlobalRulesService: DoGlobalRulesService) {
    doGlobalRulesService.addGlobalRules(ruleSet);
  }
}
```

### <a id="setupRouting"></a>Setup Routing

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

### <a id="checkAccess"></a>Check the access

```ts
```

```html
```

## Component

```html 
<do-provide-rules></do-provide-rules>
```

| Properties | Type | Description |
| --- | --- | --- |
| rules | [DoStringDictionary](#DoStringDictionary)\<[DoRuleType](#DoRuleType)> \| [DoRuleType](#DoRuleType) |  |
| roles | [DoRuleType](#DoRuleType)[] |  |

## Guard

```ts
DoCanGuard
```

| Properties | Type | Description |
| --- | --- | --- |
| rules | string[] |  |


## Pipe

`doCan`

| Properties | Type | Description |
| --- | --- | --- |
| rules | string \| [AllPossibleCheckers](#AllPossibleCheckers)[] \| [AllPossibleCheckers](#AllPossibleCheckers) \| [DoRuleType](#DoRuleType) |  |


## Functions

`doCreateRole`

| Type | Description |
| --- | --- |
| string |  |

`doCreateRuleSet`

| Type | Description |
| --- | --- |
| [RuleSet](#RuleSet) |  |

`doCreateRule`

| Type | Description |
| --- | --- |
| string |  |
| [AllPossibleCheckers](#AllPossibleCheckers)[] |  |
| Optional\<[DoRuleOptions](#DoRuleOptions)> |  |

`doNot`

| Type | Description |
| --- | --- |
| [AllPossibleCheckers](#AllPossibleCheckers) |  |
| Optional\<[DoRuleOptions](#DoRuleOptions)> |  |
| Optional\<string> |  |



----
### <a id="DoStringDictionary"></a>DoStringDictionary


### <a id="DoRuleType"></a>DoRuleType 


### <a id="AllPossibleCheckers"></a>AllPossibleCheckers


### <a id="RuleSet"></a>RuleSet
```ts
{
    [roleName: string]: [AllPossibleCheckers](#AllPossibleCheckers)[]
}
```

### <a id="DoRuleOptions"></a>DoRuleOptions

### <a id="DoCheckerFunction"></a>DoCheckerFunction
```ts
(args: any[], dependency: Dependency) => boolean
```

### <a id="Dependency"></a>Dependency
```ts
export type Dependency = [DoRoleType[], DoStringDictionary<DoRuleType>];
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

