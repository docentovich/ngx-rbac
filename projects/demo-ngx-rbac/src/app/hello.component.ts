import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  doCreatRule,
  doCreatRuleSet,
  DoGlobalRulesService,
  DoProvideRulesComponent
} from '@do/ngx-rbac';
import { admin, guest } from './app.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hello',
  template: `
    <h1>
      hello {{ ((source?.provideRulesService.changes$ | async)?.roles)[0]?.name }}
    </h1>

    <hr/>

    <do-provide-rules [rules]="rules">
      Debug <div [innerHTML]="'TEST_STRING_RULE' | doDebug"></div><br/>
      can GUEST: {{ 'GUEST_CAN' | doCan }}<br/>
      can ADMIN: {{ 'ADMIN_CAN' | doCan }}<br/>
      can inherited_GUEST_CAN (1:2): {{ 'inherited_ADMIN_CAN' | doCan: 1:2 }}<br/>
      can inherited_GUEST_CAN (2:2): {{ 'inherited_ADMIN_CAN' | doCan: 2:2 }}<br/>
      <br/>
      doCan IS_MODERATOR:
      <div [innerHTML]="'IS_MODERATOR' | doCan"></div>
      doDebug IS_MODERATOR:
      <div [innerHTML]="'IS_MODERATOR' | doDebug"></div>
      <br/><br/>
      <app-deep></app-deep>
      <do-debug></do-debug>
    </do-provide-rules>

    <hr/>
    <a routerLink="/route1">only admin</a><br/>
    <a routerLink="/route2">only guest</a><br/>
    <a routerLink="/route3">guest</a><br/>
    <a routerLink="/route4">moderator</a><br/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelloComponent implements OnInit, OnDestroy {
  public static rules1 = doCreatRuleSet({
    GUEST_CAN: [guest],
    ADMIN_CAN: [admin],
    CHAIN_WITH_STRING_RULE: [admin],
  });

  public static inheritedRules = doCreatRuleSet({
    TEST_STRING_RULE: [
      'CHAIN_GLOBAL_WITH_STRING_RULE',
      ([arg1, arg2]) => {
        return arg1 === arg2;
      },
    ],
  });

  protected destroy$ = new Subject<void>();
  constructor(
    @Optional()
    @SkipSelf()
    public source: DoProvideRulesComponent,
    public doGlobalRulesService: DoGlobalRulesService
  ) {
    const r1 = doCreatRule('r1', [() => true]);
    const r2 = doCreatRule('r2', [r1]);
  }

  rules = { ...HelloComponent.rules1, ...HelloComponent.inheritedRules };

  ngOnInit(): void {
    console.log(
      'static ' +
        this.source?.provideRulesService.rolesValue[0]?.name +
        ' can GUARD_RULE ' +
        this.source?.provideRulesService.can('GUARD_RULE')
    );
    this.source?.provideRulesService.can$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ roles, can }) => {
        console.log(
          roles[0]?.name + ' can GUARD_RULE ' + can('GUARD_RULE')
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
