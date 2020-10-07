import { Injectable, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';

import { DoGlobalRulesService } from './do-global-rules.service';
import { DoStringDictionary } from '../type/do-named-dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable()
export class DoProvideRulesService implements OnDestroy {
  private _rules$: BehaviorSubject<
    DoStringDictionary<DoRuleType>
  > = new BehaviorSubject<DoStringDictionary<DoRuleType>>({});

  private destroy$ = new Subject<void>();
  rules$: Observable<
    DoStringDictionary<DoRuleType>
  > = this._rules$.asObservable();

  public get localRulesValue(): DoStringDictionary<DoRuleType> {
    return this._rules$.value;
  }
  public get mergedRulesValue(): DoStringDictionary<DoRuleType> {
    return { ...this.globalRulesService.rulesValue, ...this.localRulesValue };
  }
  public get userRolesValue(): DoRoleType[] {
    return this.globalRulesService.userRolesValue;
  }

  changes$ = combineLatest([
    this.rules$,
    this.globalRulesService.changes$,
  ]).pipe(
    takeUntil(this.destroy$),
    map(([localRules, { globalRules, userRoles }]) => ({
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
      [
        this.globalRulesService.userRolesValue,
        this.mergedRulesValue,
      ],
      this.mergedRulesValue,
      ruleName,
      args
    );
  }

  nextRules(rules: DoStringDictionary<DoRuleType>) {
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
