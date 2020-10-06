import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  creatRule,
  Dictionary,
  DoGlobalRulesService,
  DoProvideRulesComponent,
  DoRoleType,
  DoRuleType,
} from '@do/ngx-rbac';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hello',
  template: `
    <h1>
      hello {{ ((doGlobalRulesService?.changes$ | async)?.userRoles)[0]?.name }}
    </h1>

    <hr />

    <do-provide-rules [rules]="rules">
      can GUEST: {{ 'GUEST_CAN' | doCan }}<br />
      can ADMIN: {{ 'ADMIN_CAN' | doCan }}<br />
      can inherited_GUEST_CAN: {{ 'inherited_ADMIN_CAN' | doCan: 1:2 }}<br />
      can inherited_GUEST_CAN: {{ 'inherited_ADMIN_CAN' | doCan: 2:2 }}<br />
      <br />
      <app-deep></app-deep>
    </do-provide-rules>

    <hr />
    <a routerLink="/route1">only admin</a><br />
    <a routerLink="/route2">only guest</a><br />
    <a routerLink="/route3">guest and admin</a><br />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelloComponent implements OnInit, OnDestroy {
  public static rules1: Dictionary<DoRuleType> = {
    GUEST_CAN: creatRule([AppComponent.guest]),
    ADMIN_CAN: creatRule([AppComponent.admin]),
  };

  public static inheritedRules: Dictionary<DoRuleType> = {
    inherited_ADMIN_CAN: creatRule([
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
    public source: DoProvideRulesComponent,
    public doGlobalRulesService: DoGlobalRulesService
  ) {}

  rules = { ...HelloComponent.rules1, ...HelloComponent.inheritedRules };

  ngOnInit(): void {
    console.log(
      'static ' +
        this.source?.provideRulesService.userRolesValue[0]?.name +
        ' can GUARD_RULE ' +
        this.source?.provideRulesService.can('GUARD_RULE')
    );
    this.source?.provideRulesService.can$
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
