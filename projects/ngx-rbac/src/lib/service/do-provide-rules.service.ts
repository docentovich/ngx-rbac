import { Injectable, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';

import { DoGlobalRulesService, permitted } from './do-global-rules.service';
import { DoStringDictionary } from '../type/do-dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { commonCan } from '../helper/common-can';

@Injectable()
export class DoProvideRulesService implements OnDestroy {
  private destroy$ = new Subject<void>();

  /** Rules getters */
  private _permitted$: BehaviorSubject<
    DoStringDictionary<DoRuleType>
  > = new BehaviorSubject<DoStringDictionary<DoRuleType>>({});
  private _rules$: BehaviorSubject<
    DoStringDictionary<DoRuleType>
  > = new BehaviorSubject({});

  rules$: Observable<
    DoStringDictionary<DoRuleType>
  > = this._rules$.asObservable();
  permitted$: Observable<
    DoStringDictionary<DoRuleType>
  > = this._permitted$.asObservable();

  private parentRules: DoStringDictionary<DoRuleType>;

  public get permissionsValue(): DoStringDictionary<DoRuleType> {
    return this._permitted$.value;
  }
  // Rules: parent and current
  public get localRulesValue(): DoStringDictionary<DoRuleType> {
    return this._rules$.value;
  }

  // Rules: global and parent
  public get mergedParentRulesValue(): DoStringDictionary<DoRuleType> {
    return {
      ...this.globalRulesService.rulesAndPermissionsValue,
      ...this.parentRules,
    };
  }

  // Rules: global, parent and current
  public get mergedRulesValue(): DoStringDictionary<DoRuleType> {
    return {
      ...this.globalRulesService.rulesAndPermissionsValue,
      ...this.localRulesValue,
    };
  }

  // Rules: permissions, global, parent and current
  public get mergedRulesAndPermissionsValue(): DoStringDictionary<DoRuleType> {
    return { ...this.permissionsValue, ...this.mergedRulesValue };
  }

  /** Roles getters */
  private _roles$: BehaviorSubject<DoRoleType[]> = new BehaviorSubject([]);

  roles$: Observable<DoRoleType[]> = this._roles$.asObservable();

  private parentRoles: DoRoleType[];

  // Roles: parent and current
  public get localRolesValue(): DoRoleType[] {
    return this._roles$.value;
  }

  // Roles: global and parent
  public get mergedParentRolesValue(): DoRoleType[] {
    return [...this.globalRulesService.rolesValue, ...this.parentRoles];
  }
  // Roles: global, parent and current
  public get rolesValue(): DoRoleType[] {
    return [...this.globalRulesService.rolesValue, ...this.localRolesValue];
  }

  changes$ = combineLatest([
    this.permitted$,
    this.rules$,
    this.roles$,
    this.globalRulesService.changes$,
  ]).pipe(
    takeUntil(this.destroy$),
    map(([permissions, localRules, localRoles, { globalRules, roles }]) => ({
      rules: {
        ...permissions,
        ...globalRules,
        ...localRules,
      },
      roles: [...roles, ...localRoles],
    }))
  );

  can$ = this.changes$.pipe(
    map(({ rules, roles }) => ({
      rules,
      roles,
      can: commonCan.bind(null, [roles], rules),
    }))
  );

  constructor(private globalRulesService: DoGlobalRulesService) {}

  can(ruleName: string, args?: any[]): any {
    return commonCan(
      [this.globalRulesService.rolesValue, this.mergedRulesAndPermissionsValue],
      this.mergedRulesAndPermissionsValue,
      ruleName,
      args
    );
  }

  nextRules(
    parentRules: DoStringDictionary<DoRuleType>,
    rules: DoStringDictionary<DoRuleType>
  ) {
    DoGlobalRulesService.nameRules(parentRules);
    DoGlobalRulesService.nameRules(rules);

    this.parentRules = parentRules;
    const concatRules = { ...parentRules, ...rules };
    this._rules$.next(concatRules);
  }

  nextRoles(parentRoles: DoRoleType[], roles: DoRoleType[]) {
    this.parentRoles = parentRoles;
    const concatRoles = [...parentRoles, ...roles];
    this._permitted$.next(permitted(concatRoles));
    this._roles$.next(concatRoles);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
