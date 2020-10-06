import { Injectable, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';

import { DoGlobalRulesService } from './do-global-rules.service';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable()
export class ProvideRulesService implements OnDestroy {
  private _rules$: BehaviorSubject<
    Dictionary<DoRuleType>
  > = new BehaviorSubject<Dictionary<DoRuleType>>({});

  private destroy$ = new Subject<void>();
  rules$: Observable<Dictionary<DoRuleType>> = this._rules$.asObservable();

  public get localRulesValue(): Dictionary<DoRuleType> {
    return this._rules$.value;
  }
  public get userRolesValue(): DoRoleType[] {
    return this.globalRulesService.userRolesValue;
  }

  changes$ = combineLatest([
    this.rules$,
    this.globalRulesService.changes$,
  ]).pipe(
    takeUntil(this.destroy$),
    map(([localRules, [globalRules, userRoles]]) => ({
      rules: {
        ...globalRules,
        ...localRules,
      },
      userRoles,
    }))
  );

  can$ = this.changes$.pipe(
    map(({ rules, userRoles }) => ({
      rules,
      userRoles,
      can: commonCan.bind(null, [userRoles], rules),
    }))
  );

  constructor(private globalRulesService: DoGlobalRulesService) {}

  can(ruleName: string, args?: any[]): any {
    return commonCan(
      [this.globalRulesService.userRolesValue],
      { ...this.globalRulesService.rulesValue, ...this.localRulesValue },
      ruleName,
      args
    );
  }

  nextRules(rules: Dictionary<DoRuleType>) {
    DoGlobalRulesService.nameRules(rules);
    this._rules$.next(rules);
  }

  nextRoles(userRoles: DoRoleType[]) {
    this.globalRulesService.changeRoles(userRoles);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
