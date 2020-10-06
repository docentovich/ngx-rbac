import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StringDictionary } from '../type/named-dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable()
export class DoGlobalRulesService {
  private _userRoles$: BehaviorSubject<DoRoleType[]> = new BehaviorSubject<
    DoRoleType[]
  >([]);

  private _rules$: BehaviorSubject<
    StringDictionary<DoRuleType>
  > = new BehaviorSubject<StringDictionary<DoRuleType>>({});

  rules$: Observable<
    StringDictionary<DoRuleType>
  > = this._rules$.asObservable();
  userRoles$: Observable<DoRoleType[]> = this._userRoles$.asObservable();
  changes$ = combineLatest([this.rules$, this.userRoles$]).pipe(
    map(([globalRules, userRoles]) => ({ globalRules, userRoles }))
  );

  // todo check if possible mutation
  public static nameRules(rules: StringDictionary<DoRuleType>): void {
    Object.entries(rules).forEach(([name, rule]) => rule.setName(name));
  }

  public get userRolesValue(): DoRoleType[] {
    return this._userRoles$.value;
  }

  public get rulesValue(): StringDictionary<DoRuleType> {
    return this._rules$.value;
  }

  addGlobalRules(rules: StringDictionary<DoRuleType>) {
    DoGlobalRulesService.nameRules(rules);
    this._rules$.next({
      ...(this.rulesValue || {}),
      ...(rules || {}),
    });
  }

  changeRoles(userRoles: DoRoleType[]) {
    this._userRoles$.next(userRoles);
  }

  can(ruleName: string, ...args: any[]): any {
    return commonCan(
      [this.userRolesValue, this.rulesValue],
      this.rulesValue,
      ruleName,
      args
    );
  }
}
