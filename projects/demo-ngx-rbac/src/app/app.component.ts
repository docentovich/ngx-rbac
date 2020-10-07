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
  public static moderator: DoRoleType = doCreatRole('MODERATOR', AppComponent.guest);
  public static admin: DoRoleType = doCreatRole('ADMIN', AppComponent.moderator);

  public static rules = doCreatRuleSet({
    GUARD_RULE: [AppComponent.admin],
    GUEST_and_ADMIN: [AppComponent.guest],
    IS_MODERATOR: [AppComponent.moderator],
    CHAIN_GLOBAL_WITH_STRING_RULE: [
      (args) => {
        return args[1] === 'and global';
      },
    ],
    ONLY_GUEST: [AppComponent.guest, doNot(AppComponent.moderator)],
  });
  guest: DoRoleType = AppComponent.guest;
  admin: DoRoleType = AppComponent.admin;
  moderator: DoRoleType = AppComponent.moderator;
  myRoles = [this.admin];
  rules = AppComponent.rules;

  constructor(public doGlobalRulesService: DoGlobalRulesService) {
    doGlobalRulesService.addGlobalRules(AppComponent.rules);
  }

  doNothing() {
    console.log('doNothing');
  }
}
