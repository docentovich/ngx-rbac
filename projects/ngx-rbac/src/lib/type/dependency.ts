import { DoRoleType, DoRuleType, StringDictionary } from '@do/ngx-rbac';

export type Dependency = [DoRoleType[], StringDictionary<DoRuleType>];
