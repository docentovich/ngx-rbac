import { Injectable } from '@angular/core';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable()
export class GlobalRulesService {
  rules: Dictionary<DoRuleType> = {};
  userRoles: DoRoleType[] = [];

  addGuardRules(rules: Dictionary<DoRuleType>) {
    this.rules = {
      ...(this.rules || {}),
      ...(rules || {}),
    };
  }

  addRoles(userRoles: DoRoleType[]) {
    this.userRoles = userRoles;
  }

  can(ruleName: string, ...args: any[]): any {
    return commonCan([this.userRoles], this.rules, ruleName, args);
  }
}
