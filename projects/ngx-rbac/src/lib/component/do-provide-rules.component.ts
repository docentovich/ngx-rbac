import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { ProvideRulesService } from '../service/provide-rules.service';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalRulesService } from '../service/global-rules.service';

@Component({
  selector: 'do-provide-rules',
  template: ` <ng-content></ng-content>`,
  styles: [],
  providers: [ProvideRulesService],
})
export class DoProvideRulesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() guardRules: Dictionary<DoRuleType> = {};
  @Input() rules: Dictionary<DoRuleType> = {};
  @Input() roles: DoRoleType[];
  rulesComputed: Dictionary<DoRuleType> = {};
  userRolesComputed: DoRoleType[] = [];
  protected destroy$ = new Subject<void>();

  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent,
    public provideRulesService: ProvideRulesService,
    private globalRulesService: GlobalRulesService
  ) {}

  ngOnInit(): void {
    this.source?.provideRulesService
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ rules, userRoles }) => {
        this.concatRules(this.rules, this.roles);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.rules?.currentValue !== changes.rules?.previousValue ||
      changes.roles?.currentValue !== changes.roles?.previousValue
    ) {
      this.concatRules(
        changes.rules?.currentValue || this.rules || {},
        changes.roles?.currentValue
      );
    }

    if (
      changes.guardRules?.currentValue !== changes.guardRules?.previousValue
    ) {
      this.addGuardRules(changes.guardRules?.currentValue);
    }
  }

  can(ruleName: string, args: any[]): any {
    return this.provideRulesService.can(ruleName, args);
  }

  private concatRules(
    rules: Dictionary<DoRuleType>,
    userRoles: DoRoleType[]
  ): void {
    this.userRolesComputed = userRoles || this.source?.roles || [];
    this.rulesComputed = {
      ...(rules || {}),
      ...(this.source?.rules || {}),
    };

    this.provideRulesService.nextRulesAndRoles(
      this.rules,
      this.userRolesComputed
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private addGuardRules(rules: Dictionary<DoRuleType>) {
    this.globalRulesService.addGuardRules(rules);
  }
}
