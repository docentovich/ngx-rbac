import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DoGlobalRulesService } from './do-global-rules.service';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable()
// @ts-ignore
// todo instead of extends BehaviorSubject use property
// because merging with global rules and dependency will not propagate  inside subscription,
// implement change$ [globalRules, localRules, globalRoles] in order to simplify communication with pipe
// do not forget to use destroy$
export class ProvideRulesService extends BehaviorSubject<{
  rules: Dictionary<DoRuleType>;
  userRoles: DoRoleType[];
  can: (ruleName: string, args?: any[]) => boolean;
}> {
  rules: Dictionary<DoRuleType>;

  constructor(private globalRulesService: DoGlobalRulesService) {
    super({
      rules: null,
      userRoles: null,
      can: () => {
        throw Error('Can method should be initialized');
      },
    });
  }

  can(ruleName: string, args?: any[]): any {
    return commonCan(
      [this.globalRulesService.userRolesValue],
      { ...this.rules, ...this.globalRulesService.rules },
      ruleName,
      args
    );
  }

  nextRulesAndRoles(rules: Dictionary<DoRuleType>, userRoles: DoRoleType[]) {
    this.addRules(rules);
    this.globalRulesService.changeRoles(userRoles);
    this.next({
      rules,
      userRoles: this.globalRulesService.userRolesValue,
      can: commonCan.bind(null, [userRoles], {
        ...this.globalRulesService.rules,
        ...rules,
      }),
    });
  }

  protected next(value: {
    rules: Dictionary<DoRuleType>;
    userRoles: DoRoleType[];
    can: (ruleName: string, args?: any[]) => boolean;
  }) {
    super.next(value);
  }

  private addRules(rules: Dictionary<DoRuleType>) {
    DoGlobalRulesService.nameRules(rules);
    this.rules = rules;
  }
}
