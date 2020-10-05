import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { ProvideRulesService } from '../service/provide-rules.service';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoRoleType } from '../type/do-role-type';

@Component({
  selector: 'do-provide-rules',
  template: ` <ng-content></ng-content>`,
  styles: [],
  providers: [ProvideRulesService],
})
export class DoProvideRulesComponent implements OnInit, OnChanges {
  @Input() rules: Dictionary<DoRuleType> = {};
  @Input() roles: DoRoleType[] = [];
  rulesDictionary: Dictionary<DoRuleType> = {};
  userRolesArray: DoRoleType[] = [];

  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent,
    public provideRulesService: ProvideRulesService
  ) {}

  ngOnInit(): void {
    this.chainRules(this.rules, this.roles);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chainRules(
      changes.rules.currentValue,
      changes.roles?.currentValue || []
    );
  }

  can(value: DoRuleType, args: any[]): any {
    return this.provideRulesService.can(value, args);
  }

  private chainRules(
    rules: Dictionary<DoRuleType>,
    userRoles: DoRoleType[]
  ): void {
    this.userRolesArray = (userRoles || []);
    this.rulesDictionary = {
      ...(rules || {}),
      ...(this.source?.rulesDictionary || {}),
    };

    this.provideRulesService.addRules(this.rulesDictionary);
    this.provideRulesService.addRoles(this.userRolesArray);
  }
}
