import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';

import { DoProvideRulesService } from '../service/do-provide-rules.service';
import { DoStringDictionary } from '../type/do-dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { TypedSimpleChanges } from '../type/typed-simple-changes';
import { takeUntil } from 'rxjs/operators';
import { DoRule } from '../model/do-rule';

interface IDoProvideRulesComponent {
  rules: DoStringDictionary<DoRuleType> | DoRuleType;
  roles: DoRoleType[];
}

@Component({
  selector: 'do-provide-rules',
  template: `<ng-content></ng-content>`,
  styles: [],
  providers: [DoProvideRulesService],
})
export class DoProvideRulesComponent
  implements OnChanges, IDoProvideRulesComponent, OnDestroy, OnInit {
  @Input() rules: DoStringDictionary<DoRuleType> | DoRuleType = {};
  @Input() roles: DoRoleType[];

  private destroy$ = new Subject<void>();

  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent,
    public provideRulesService: DoProvideRulesService
  ) {}

  ngOnChanges(changes: TypedSimpleChanges<IDoProvideRulesComponent>): void {
    if (
      changes.rules?.currentValue &&
      changes.rules?.currentValue !== changes.rules?.previousValue
    ) {
      this.concatRules(
        this.source?.provideRulesService.localRulesValue,
        changes.rules.currentValue
      );
    }

    if (
      changes.roles?.currentValue &&
      changes.roles?.currentValue !== changes.roles?.previousValue
    ) {
      this.concatRoles(
        this.source?.provideRulesService.localRolesValue,
        changes.roles.currentValue
      );
    }
  }

  can(ruleName: string, args: any[]): any {
    return this.provideRulesService.can(ruleName, args);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    this.source?.provideRulesService.rules$
      .pipe(takeUntil(this.destroy$))
      .subscribe((parentRules) => this.concatRules(parentRules, this.rules));
    this.source?.provideRulesService.roles$
      .pipe(takeUntil(this.destroy$))
      .subscribe((parentRoles) => this.concatRoles(parentRoles, this.roles));
  }

  private concatRules(
    parentRules: DoStringDictionary<DoRuleType>,
    currentRules: DoStringDictionary<DoRuleType> | DoRuleType
  ): void {
    if (currentRules instanceof DoRule) {
      currentRules = { [currentRules.name]: currentRules };
    }
    this.provideRulesService.nextRules(
      parentRules || {},
      (currentRules as DoStringDictionary<DoRuleType>) || {}
    );
  }

  private concatRoles(
    parentRoles: DoRoleType[],
    currentRoles: DoRoleType[]
  ): void {
    this.provideRulesService.nextRoles(parentRoles || [], currentRoles || []);
  }
}
