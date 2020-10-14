import { DoRoleType } from '../type/do-role-type';
import { DoRolePermissionType } from '../type/do-role-permission-type';
import { DoRuleType } from '../type/do-rule-type';
import { DoRolePermission } from './do-role-permission';

export class DoRole extends DoRolePermission {
  addChild(child: DoRolePermissionType) {
    this.can = { ...this.can, ...child.can };
    this.canNames = [...this.canNames, ...child.canNames];
  }

  addRule(rule: DoRuleType) {
    this.can[rule.name] = rule;
  }

  toString() {
    return this.name;
  }
}

export function doCreatRole(name: string): DoRoleType {
  return new DoRole(name);
}
