import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DoStringDictionary } from '../type/do-dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable({ providedIn: 'root' })
export class DoGlobalRulesService {
  private _userRoles$: BehaviorSubject<DoRoleType[]> = new BehaviorSubject<
    DoRoleType[]
  >([]);

  private _rules$: BehaviorSubject<
    DoStringDictionary<DoRuleType>
  > = new BehaviorSubject<DoStringDictionary<DoRuleType>>({});

  private _permitted$: BehaviorSubject<
    DoStringDictionary<DoRuleType>
  > = new BehaviorSubject<DoStringDictionary<DoRuleType>>({});

  rules$: Observable<
    DoStringDictionary<DoRuleType>
  > = this._rules$.asObservable();
  userRoles$: Observable<DoRoleType[]> = this._userRoles$.asObservable();
  permitted$: Observable<
    DoStringDictionary<DoRuleType>
  > = this._permitted$.asObservable();

  changes$ = combineLatest([
    this.permitted$,
    this.rules$,
    this.userRoles$,
  ]).pipe(
    map(([permissions, globalRules, userRoles]) => ({
      globalRules: { ...permissions, ...globalRules },
      userRoles,
    }))
  );

  // todo check if possible mutation
  public static nameRules(rules: DoStringDictionary<DoRuleType>): void {
    Object.entries(rules).forEach(([name, rule]) => rule.setName(name));
  }

  public get userRolesValue(): DoRoleType[] {
    return this._userRoles$.value;
  }

  public get permissionsValue(): DoStringDictionary<DoRuleType> {
    return this._permitted$.value;
  }

  public get rulesValue(): DoStringDictionary<DoRuleType> {
    return this._rules$.value;
  }

  public get rulesAndPermissionsValue(): DoStringDictionary<DoRuleType> {
    return { ...this.permissionsValue, ...this.rulesValue };
  }

  addGlobalRules(rules: DoStringDictionary<DoRuleType>) {
    DoGlobalRulesService.nameRules(rules);
    this._rules$.next({
      ...(this.rulesValue || {}),
      ...(rules || {}),
    });
  }

  changeRoles(userRoles: DoRoleType[]) {
    this._permitted$.next(
      userRoles.reduce(
        (acc: DoStringDictionary<DoRuleType>, userRole) => ({
          ...acc,
          ...userRole.can,
        }),
        {}
      )
    );
    this._userRoles$.next(userRoles);
  }

  can(ruleName: string, ...args: any[]): any {
    return commonCan(
      [this.userRolesValue, this.rulesAndPermissionsValue],
      this.rulesAndPermissionsValue,
      ruleName,
      args
    );
  }

  removeAllGlobalRules(): void {
    this._rules$.next({});
  }

  removeGlobalRulesByName(ruleNames: string[]): void {
    const rules = this._rules$.value;
    ruleNames.forEach((ruleName) => {
      delete rules[ruleName];
    });
    this._rules$.next(this.filterRule((rule) => ruleNames.includes(rule.name)));
  }

  removeGlobalRulesByGroupName(groupName: string): void {
    this._rules$.next(
      this.filterRule((rule) => rule.options.groupName !== groupName)
    );
  }

  private filterRule(
    needAddMethod: (rule: DoRuleType) => boolean
  ): DoStringDictionary<DoRuleType> {
    return Object.values(this._rules$.value).reduce((acc, nextRule) => {
      return {
        ...acc,
        ...(needAddMethod(nextRule) ? { [nextRule.name]: nextRule } : {}),
      };
    }, {});
  }
}
