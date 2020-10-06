import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';
import { map } from 'rxjs/operators';

@Injectable()
export class DoGlobalRulesService {
  private _userRoles$: BehaviorSubject<DoRoleType[]> = new BehaviorSubject<
    DoRoleType[]
  >([]);

  private _rules$: BehaviorSubject<
    Dictionary<DoRuleType>
  > = new BehaviorSubject<Dictionary<DoRuleType>>({});

  rules$: Observable<Dictionary<DoRuleType>> = this._rules$.asObservable();
  userRoles$: Observable<DoRoleType[]> = this._userRoles$.asObservable();
  changes$ = combineLatest([this.rules$, this.userRoles$]).pipe(
    map(([globalRules, userRoles]) => ({ globalRules, userRoles }))
  );

  // todo check if possible mutation
  public static nameRules(rules: Dictionary<DoRuleType>): void {
    Object.entries(rules).forEach(([name, rule]) => rule.setName(name));
  }

  public get userRolesValue(): DoRoleType[] {
    return this._userRoles$.value;
  }

  public get rulesValue(): Dictionary<DoRuleType> {
    return this._rules$.value;
  }

  addGlobalRules(rules: Dictionary<DoRuleType>) {
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
    return commonCan([this._userRoles$.value], this.rulesValue, ruleName, args);
  }
}