import { Injectable } from '@angular/core';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DoGlobalRulesService {
  // todo implement rules observable like roles, in order to propagate global rules changed
  rules: Dictionary<DoRuleType> = {};
  // tslint:disable-next-line:variable-name
  private _userRoles: BehaviorSubject<DoRoleType[]> = new BehaviorSubject<
    DoRoleType[]
  >([]);

  public userRoles: Observable<DoRoleType[]> = this._userRoles.asObservable();

  // todo check if possible mutation
  public static nameRules(rules: Dictionary<DoRuleType>): void {
    Object.entries(rules).forEach(([name, rule]) => rule.setName(name));
  }

  public get userRolesValue(): DoRoleType[] {
    return this._userRoles.value;
  }

  addGlobalRules(rules: Dictionary<DoRuleType>) {
    DoGlobalRulesService.nameRules(rules);
    this.rules = {
      ...(this.rules || {}),
      ...(rules || {}),
    };
  }

  changeRoles(userRoles: DoRoleType[]) {
    this._userRoles.next(userRoles);
  }

  can(ruleName: string, ...args: any[]): any {
    return commonCan([this._userRoles.value], this.rules, ruleName, args);
  }
}
