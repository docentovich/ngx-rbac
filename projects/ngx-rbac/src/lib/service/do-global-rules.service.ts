import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DoStringDictionary } from '../type/do-dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable({ providedIn: 'root' })
export class DoGlobalRulesService {
  /** Rules getters */
  private _rules$: BehaviorSubject<
    DoStringDictionary<DoRuleType>
    > = new BehaviorSubject<DoStringDictionary<DoRuleType>>({});

  private _permitted$: BehaviorSubject<
    DoStringDictionary<DoRuleType>
    > = new BehaviorSubject<DoStringDictionary<DoRuleType>>({});

  rules$: Observable<
    DoStringDictionary<DoRuleType>
    > = this._rules$.asObservable();
  permitted$: Observable<
    DoStringDictionary<DoRuleType>
    > = this._permitted$.asObservable();


  public get permissionsValue(): DoStringDictionary<DoRuleType> {
    return this._permitted$.value;
  }

  public get rulesValue(): DoStringDictionary<DoRuleType> {
    return this._rules$.value;
  }

  public get rulesAndPermissionsValue(): DoStringDictionary<DoRuleType> {
    return { ...this.permissionsValue, ...this.rulesValue };
  }

  /** Roles getters */
  private _roles$: BehaviorSubject<DoRoleType[]> = new BehaviorSubject<
    DoRoleType[]
  >([]);

  roles$: Observable<DoRoleType[]> = this._roles$.asObservable();

  public get rolesValue(): DoRoleType[] {
    return this._roles$.value;
  }


  changes$ = combineLatest([
    this.permitted$,
    this.rules$,
    this.roles$,
  ]).pipe(
    map(([permissions, globalRules, roles]) => ({
      globalRules: { ...permissions, ...globalRules },
      roles,
    }))
  );

  // todo check if possible mutation
  public static nameRules(rules: DoStringDictionary<DoRuleType>): void {
    Object.entries(rules).forEach(([name, rule]) => rule.setName(name));
  }

  public static permitted(roles: DoRoleType[]) {
    return roles.reduce(
      (acc: DoStringDictionary<DoRuleType>, role) => ({
        ...acc,
        ...role.can,
      }),
      {}
    );
  }

  addGlobalRules(rules: DoStringDictionary<DoRuleType>, replaceGroupName?: string) {
    DoGlobalRulesService.nameRules(rules);
    if (replaceGroupName !== undefined) {
      this.removeGlobalRulesByGroupName(replaceGroupName);
    }
    this._rules$.next({
      ...(this.rulesValue || {}),
      ...(rules || {}),
    });
  }

  changeRoles(roles: DoRoleType[]) {
    this._permitted$.next(
      DoGlobalRulesService.permitted(roles)
    );
    this._roles$.next(roles);
  }

  can(ruleName: string, ...args: any[]): any {
    return commonCan(
      [this.rolesValue, this.rulesAndPermissionsValue],
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
