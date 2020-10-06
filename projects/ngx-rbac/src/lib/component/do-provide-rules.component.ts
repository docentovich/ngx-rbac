import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import { Subject } from 'rxjs';

import { ProvideRulesService } from '../service/provide-rules.service';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';
import { DoGlobalRulesService } from '../service/do-global-rules.service';
import { TypedSimpleChanges } from '../type/typed-simple-changes';

interface IDoProvideRulesComponent {
  globalRules: Dictionary<DoRuleType>;
  rules: Dictionary<DoRuleType>;
  roles: DoRoleType[];
}

@Component({
  selector: 'do-provide-rules',
  template: ` <ng-content></ng-content>`,
  styles: [],
  providers: [ProvideRulesService],
})
export class DoProvideRulesComponent
  implements OnChanges, IDoProvideRulesComponent, OnDestroy {
  @Input() globalRules: Dictionary<DoRuleType> = {};
  @Input() rules: Dictionary<DoRuleType> = {};
  @Input() roles: DoRoleType[];

  rulesComputed: Dictionary<DoRuleType> = {};
  private destroy$ = new Subject<void>();

  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent,
    public provideRulesService: ProvideRulesService,
    private globalRulesService: DoGlobalRulesService
  ) {}

  ngOnChanges(changes: TypedSimpleChanges<IDoProvideRulesComponent>): void {
    if (changes.rules?.currentValue !== changes.rules?.previousValue) {
      this.concatRules(changes.rules?.currentValue || this.rules || {});
    }

    if (changes.roles?.currentValue !== changes.roles?.previousValue) {
      this.provideRulesService.nextRoles(changes.roles?.currentValue);
    }

    if (
      changes.globalRules?.currentValue &&
      changes.globalRules?.currentValue !== changes.globalRules?.previousValue
    ) {
      this.globalRulesService.addGlobalRules(changes.globalRules?.currentValue);
    }
  }

  can(ruleName: string, args: any[]): any {
    return this.provideRulesService.can(ruleName, args);
  }

  private concatRules(rules: Dictionary<DoRuleType>): void {
    this.rulesComputed = {
      ...(this.source?.rules || {}),
      ...(rules || {}),
    };

    this.provideRulesService.nextRules(this.rulesComputed);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
