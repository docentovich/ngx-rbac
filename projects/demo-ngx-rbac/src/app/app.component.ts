import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  creatRole,
  creatRule,
  Dictionary,
  DoGlobalRulesService,
  doNot,
  DoRoleType,
  DoRuleType,
} from '@do/ngx-rbac';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public static guest: DoRoleType = creatRole('GUEST');
  public static admin: DoRoleType = creatRole('ADMIN', AppComponent.guest);

  public static rules: Dictionary<DoRuleType> = {
    GUARD_RULE: creatRule([AppComponent.admin]),
    GUEST_and_ADMIN: creatRule([AppComponent.guest]),
    ONLY_GUEST: creatRule([AppComponent.guest, ...doNot(AppComponent.admin)]),
  };
  guest: DoRoleType = AppComponent.guest;
  admin: DoRoleType = AppComponent.admin;
  myRoles = [this.admin];

  constructor(doGlobalRulesService: DoGlobalRulesService) {
    doGlobalRulesService.addGlobalRules(AppComponent.rules);
  }

  doNothing() {
    console.log('doNothing');
  }
}
