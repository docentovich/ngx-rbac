import { DoStringDictionary } from '@do/ngx-rbac';
import { DoRuleType } from './do-rule-type';

export interface DoRolePermissionType {
  can: DoStringDictionary<DoRuleType>;
  canNames: string[];
  name: string;
}
