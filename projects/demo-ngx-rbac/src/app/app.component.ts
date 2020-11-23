import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  doCreatRole,
  doCreatRuleSet,
  DoGlobalRulesService,
  doNot,
  DoRoleType,
} from '@do/ngx-rbac';

export const guest: DoRoleType = doCreatRole('GUEST');
export const moderator: DoRoleType = doCreatRole('MODERATOR');
moderator.addPermissionsOf(guest);
export const admin: DoRoleType = doCreatRole('ADMIN');
admin.addPermissionsOf(moderator);

export const rules = doCreatRuleSet({
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
