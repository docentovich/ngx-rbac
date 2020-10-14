import { DoStringDictionary } from './do-dictionary';
import { DoRuleType } from './do-rule-type';

export interface DoRolePermissionType {
  can: DoStringDictionary<DoRuleType>;
  canNames: string[];
  name: string;
}
