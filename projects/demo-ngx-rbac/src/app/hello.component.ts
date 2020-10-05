import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { creatRule, Dictionary, DoProvideRulesComponent, DoRoleType, DoRuleType } from '@do/ngx-rbac';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hello',
  template: `
    <h1>hello</h1>
    <hr />

    <do-provide-rules [rules]="rules">
      {{ ((source?.provideRulesService | async)?.userRoles)[0]?.name }} can
      GUEST: {{ 'GUEST_CAN' | doCan }}<br />
      {{ ((source?.provideRulesService | async)?.userRoles)[0]?.name }} can
      ADMIN: {{ 'ADMIN_CAN' | doCan }}<br />

      {{ ((source?.provideRulesService | async)?.userRoles)[0]?.name }} can
      inherited_GUEST_CAN: {{ 'inherited_GUEST_CAN' | doCan: 1:2 }}<br />
      {{ ((source?.provideRulesService | async)?.userRoles)[0]?.name }} can
      inherited_GUEST_CAN: {{ 'inherited_GUEST_CAN' | doCan: 2:2 }}<br />
    </do-provide-rules>

    <hr />
    <hr />
    <a routerLink='/route1'>route1</a><br>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelloComponent implements OnInit, OnDestroy {
  public static rules1: Dictionary<DoRuleType> = {
    GUEST_CAN: creatRule([AppComponent.guest]),
    ADMIN_CAN: creatRule([AppComponent.admin]),
  };

  public static inheritedRules: Dictionary<DoRuleType> = {
    inherited_GUEST_CAN: creatRule([
      HelloComponent.rules1.ADMIN_CAN,
      ([arg1, arg2], [userRoles]: [DoRoleType[]]) => {
        return arg1 === arg2;
      },
    ]),
  };

  protected destroy$ = new Subject<void>();
  constructor(
    @Optional()
    @SkipSelf()
    public source: DoProvideRulesComponent
  ) {}

  rules = { ...HelloComponent.rules1, ...HelloComponent.inheritedRules };

  ngOnInit(): void {
    console.log(
      'static ' +
        this.source?.provideRulesService.userRoles[0]?.name +
        ' can GUARD_RULE ' +
        this.source?.provideRulesService.can('GUARD_RULE')
    );
    this.source?.provideRulesService
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userRoles, can }) => {
        console.log(
          userRoles[0]?.name + ' can GUARD_RULE ' + can('GUARD_RULE')
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
