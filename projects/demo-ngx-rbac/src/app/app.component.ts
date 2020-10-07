import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  doCreatRole,
  doCreatRuleSet,
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
  public static guest: DoRoleType = doCreatRole('GUEST');
  public static admin: DoRoleType = doCreatRole('ADMIN', AppComponent.guest);

  public static rules = doCreatRuleSet({
    GUARD_RULE: [AppComponent.admin],
    GUEST_and_ADMIN: [AppComponent.guest],
    CHAIN_GLOBAL_WITH_STRING_RULE: [(args) => {
      return args[1] === 'and global';
    }],
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
