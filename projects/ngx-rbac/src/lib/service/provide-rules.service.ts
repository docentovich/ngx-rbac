import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GlobalRulesService } from './global-rules.service';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable()
export class ProvideRulesService extends BehaviorSubject<{
  rules: Dictionary<DoRuleType>;
  userRoles: DoRoleType[];
  can: (ruleName: string, args?: any[]) => boolean;
}> {
  rules: Dictionary<DoRuleType>;
  userRoles: DoRoleType[];

  constructor(private globalRulesService: GlobalRulesService) {
    super({
      rules: null,
      userRoles: null,
      can: () => {
        throw Error('Can method should be initialized');
      },
    });
  }

  can(ruleName: string, args?: any[]): any {
    return commonCan([this.userRoles], this.rules, ruleName, args);
  }

  nextRulesAndRoles(rules: Dictionary<DoRuleType>, userRoles: DoRoleType[]) {
    this.addRules(rules);
    this.addRoles(userRoles);
    this.next({
      rules,
      userRoles,
      can: commonCan.bind(null, [userRoles], rules),
    });
  }

  private addRules(rules: Dictionary<DoRuleType>) {
    Object.entries(rules).forEach(([name, rule]) => rule.setName(name));
    this.rules = rules;
  }

  private addRoles(userRoles: DoRoleType[]) {
    this.globalRulesService.addRoles(userRoles);
    this.userRoles = userRoles;
  }
}
