import { Injectable } from '@angular/core';
import { GlobalRulesService } from './global-rules.service';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';

@Injectable()
export class ProvideRulesService {
  rulesDictionary: Dictionary<DoRuleType>;
  userRolesArray: DoRoleType[];

  constructor(private globalRulesService: GlobalRulesService) {}

  addRules(rulesDictionary: Dictionary<DoRuleType>) {
    this.globalRulesService.addRulesDictionary(rulesDictionary);
    this.rulesDictionary = rulesDictionary;
  }

  addRoles(userRolesArray: DoRoleType[]) {
    this.globalRulesService.addRoles(userRolesArray);
    this.userRolesArray = userRolesArray;
  }

  can(value: DoRuleType, args: any[]): any {
    return GlobalRulesService.commonCan(
      value,
      this.rulesDictionary,
      args,
      [this.userRolesArray]
    );
  }
}
