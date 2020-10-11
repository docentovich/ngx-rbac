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
import { DoGlobalRulesService } from '../service/do-global-rules.service';
import { TypedSimpleChanges } from '../type/typed-simple-changes';
import { takeUntil } from 'rxjs/operators';

interface IDoProvideRulesComponent {
  globalRules: DoStringDictionary<DoRuleType>;
  rules: DoStringDictionary<DoRuleType>;
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
  @Input() globalRules: DoStringDictionary<DoRuleType> = {};
  @Input() rules: DoStringDictionary<DoRuleType> = {};
  @Input() roles: DoRoleType[];

  private destroy$ = new Subject<void>();

  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent,
    public provideRulesService: DoProvideRulesService,
    private globalRulesService: DoGlobalRulesService
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
      this.provideRulesService.nextRoles(changes.roles.currentValue);
    }

    if (
      changes.globalRules?.currentValue &&
      changes.globalRules?.currentValue !== changes.globalRules?.previousValue
    ) {
      this.globalRulesService.addGlobalRules(changes.globalRules.currentValue);
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
  }

  private concatRules(
    parentRules: DoStringDictionary<DoRuleType>,
    currentRules: DoStringDictionary<DoRuleType>
  ): void {
    this.provideRulesService.nextRules(parentRules || {}, currentRules || {});
  }
}
