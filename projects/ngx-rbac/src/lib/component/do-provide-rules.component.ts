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
import { DoGlobalRulesService } from '../service/do-global-rules.service';

@Component({
  selector: 'do-provide-rules',
  template: ` <ng-content></ng-content>`,
  styles: [],
  providers: [ProvideRulesService],
})
export class DoProvideRulesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() globalRules: Dictionary<DoRuleType> = {};
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
    private globalRulesService: DoGlobalRulesService
  ) {}

  ngOnInit(): void {
    this.source?.provideRulesService
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ rules, userRoles }) => {
        this.concatRules(this.rules, this.roles);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // todo think about split rules and roles adding logic
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
      changes.guardRules?.currentValue &&
      changes.guardRules?.currentValue !== changes.guardRules?.previousValue
    ) {
      this.globalRulesService.addGlobalRules(changes.guardRules?.currentValue);
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
}
