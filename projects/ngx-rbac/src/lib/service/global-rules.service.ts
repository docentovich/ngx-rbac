import { Injectable } from '@angular/core';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { Dependency } from '../type/dependency';

@Injectable()
export class GlobalRulesService {
  rulesDictionary: Dictionary<DoRuleType>;
  userRolesArray: DoRoleType[];

  public static commonCan(
    value: DoRuleType,
    rulesDictionary: Dictionary<DoRuleType>,
    args: any[],
    dependency: Dependency,
  ): any {
    if (! Object.values(rulesDictionary).find(r => r.name === value.name)) {
      console.error('no rule for ' + (value?.name || 'undefined'));
      return;
    }

    return value.check(args, dependency);
  }

  addRulesDictionary(rulesDictionary: Dictionary<DoRuleType>) {
    this.rulesDictionary = {
      ...(this.rulesDictionary || {}),
      ...(rulesDictionary || {}),
    };
  }

  addRoles(userRolesArray: DoRoleType[]) {
    this.userRolesArray = [...(this.userRolesArray || []), ...(userRolesArray || [])];
  }

  can(value: DoRuleType, ...args: any[]): any {
    return GlobalRulesService.commonCan(
      value,
      this.rulesDictionary,
      args,
      [this.userRolesArray]
    );
  }
}
