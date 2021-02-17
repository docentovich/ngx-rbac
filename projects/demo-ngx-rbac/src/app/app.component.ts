import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  doCreateRole,
  doCreateRuleSet,
  DoGlobalRulesService,
  doNot,
  DoRoleType,
} from '@doce/ngx-rbac';

export const guest: DoRoleType = doCreateRole('GUEST');
export const moderator: DoRoleType = doCreateRole('MODERATOR');
moderator.addPermissionsOf(guest);
export const admin: DoRoleType = doCreateRole('ADMIN');
admin.addPermissionsOf(moderator);

export const rules = doCreateRuleSet({
  GUARD_RULE: [admin],
  GUEST_and_ADMIN: [guest],
  IS_MODERATOR: [moderator],
  CHAIN_GLOBAL_WITH_STRING_RULE: [
    (args) => {
      return args[1] === 'and global';
    },
  ],
  ONLY_GUEST: [guest, doNot(moderator)],
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  guest: DoRoleType = guest;
  admin: DoRoleType = admin;
  moderator: DoRoleType = moderator;
  myRoles = [this.admin];
  rules = rules;

  constructor(public doGlobalRulesService: DoGlobalRulesService) {
    doGlobalRulesService.addGlobalRules(rules);
  }

  doNothing() {
    console.log('doNothing');
  }
}
