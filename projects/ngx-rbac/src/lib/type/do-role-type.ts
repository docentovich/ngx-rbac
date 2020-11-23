import { DoRolePermissionType } from './do-role-permission-type';
import { DoRuleType } from './do-rule-type';
import { DoStringDictionary } from './do-dictionary';

export interface DoRoleType extends DoRolePermissionType {
  addPermissionsOf(child: DoRolePermissionType): void;
  addRule(rule: DoRuleType | DoStringDictionary<DoRuleType>): void;
}
