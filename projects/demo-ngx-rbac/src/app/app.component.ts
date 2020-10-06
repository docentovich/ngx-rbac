import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  creatRole,
  creatRuleSet,
  DoGlobalRulesService,
  doNot,
  DoRoleType,
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

  public static rules = creatRuleSet({
    GUARD_RULE: [AppComponent.admin],
    GUEST_and_ADMIN: [AppComponent.guest],
    ONLY_GUEST: [AppComponent.guest, ...doNot(AppComponent.admin)],
  });
  guest: DoRoleType = AppComponent.guest;
  admin: DoRoleType = AppComponent.admin;
  myRoles = [this.admin];
  rules = AppComponent.rules;

  constructor(public doGlobalRulesService: DoGlobalRulesService) {
    doGlobalRulesService.addGlobalRules(AppComponent.rules);
  }

  doNothing() {
    console.log('doNothing');
  }
}
