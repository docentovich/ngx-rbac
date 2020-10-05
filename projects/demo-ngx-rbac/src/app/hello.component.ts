import { Component } from '@angular/core';
import {
  creatRole,
  creatRule,
  Dictionary, doNot,
  DoRoleType,
  DoRuleType
} from '@do/ngx-rbac';

@Component({
  selector: 'app-hello',
  template: `
    <hr />
    <do-provide-rules [rules]="rules" [roles]="[admin]">
<!--      ADMIN can GUEST: {{ rules.GUEST_CAN | doCan }}<br />-->
<!--      ADMIN can ADMIN: {{ rules.ADMIN_CAN | doCan }}<br />-->

      ADMIN can inherited_GUEST_CAN: {{ rules.inherited_GUEST_CAN | doCan: 1:2 }}<br />
    </do-provide-rules>

    <hr />

<!--    <do-provide-rules [rules]="rules" [roles]="[guest]">-->
<!--      GUEST can ADMIN: {{ rules.ADMIN_CAN | doCan }}<br />-->
<!--      GUEST can GUEST: {{ rules.GUEST_CAN | doCan }}<br />-->
<!--    </do-provide-rules>-->
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `,
  ],
})
export class HelloComponent {
  public static guest: DoRoleType = creatRole('GUEST');
  // public static moder: DoRoleType = creatRole('MODERATOR');
  public static admin: DoRoleType = creatRole('ADMIN', HelloComponent.guest);

  public static rules1: Dictionary<DoRuleType> = {
    GUEST_CAN: creatRule('GUEST_CAN', [HelloComponent.guest]),
    // ADMIN_CAN: creatRule('ADMIN_CAN', [HelloComponent.admin]),
    // MODER_CAN: new DoRule('MODER_CAN', [HelloComponent.moder]),
    /*COMPLEX_RULE: new DoRule('COMPLEX_RULE', [
      and(HelloComponent.guest, HelloComponent.moder),
      or(
        new DoChecker((flag: any) => flag === 1),
        new DoChecker((flag: any) => flag === 5)
      ),
    ])*/
  };

  public static inheritedRules: Dictionary<DoRuleType> = {
    inherited_GUEST_CAN: creatRule('inherited_GUEST_CAN', [
      doNot(HelloComponent.rules1.GUEST_CAN),
      (args: any[], [userRoles]: [DoRoleType[]]) => {
        debugger;
        return true;
      },
    ]),
  };

  rules = { ...HelloComponent.rules1, ...HelloComponent.inheritedRules };
  public guest: DoRoleType = HelloComponent.guest;
  public admin: DoRoleType = HelloComponent.admin;
}
