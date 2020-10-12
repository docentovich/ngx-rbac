import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelloComponent } from './hello.component';
import { doCreatRule, doCreatRuleSet, doNot, DoAbsentRuleBehavior } from '@do/ngx-rbac';

@Component({
  selector: 'app-deep',
  template: `
    <h3>Deep</h3>
    <do-provide-rules [rules]="deepRules">
      <do-provide-rules [rules]="overrideRules">
        <blockquote>
          EXTENDED_RULE 5,5: {{ deepRules.EXTENDED_RULE | doCan: 5:5 }} <br />
          EXTENDED_RULE 5,10: {{ 'EXTENDED_RULE' | doCan: 5:10 }} <br />
          EXTENDED_RULE 10,10: {{ deepRules.EXTENDED_RULE | doCan: 10:10 }}
          <br /><br /><br />
          overrideRules GUEST_CAN: {{ overrideRules.GUEST_CAN | doCan }} <br />
          CHAINED_RULE (cool): {{ 'CHAINED_RULE' | doCan: 'cool' }} <br />
          CHAINED_GLOBAL_RULE (cool, and global):
          {{ 'CHAINED_GLOBAL_RULE' | doCan: 'cool':'and global' }} <br />
          CHAINED_GLOBAL_RULE (not cool, and global):
          {{ 'CHAINED_GLOBAL_RULE' | doCan: 'not cool':'and global' }} <br />
          CHAINED_GLOBAL_RULE (cool, and not global):
          {{ 'CHAINED_GLOBAL_RULE' | doCan: 'cool':'and not global' }} <br />
          CHAINED_RULE (not cool): {{ 'CHAINED_RULE' | doCan: 'not cool' }}
          <br />
          CHAINED_RULE_NOT (cool): {{ 'CHAINED_RULE_NOT' | doCan: 'cool' }}
          <br />
          suppressErrors (cool): {{ 'suppressErrors' | doCan: 'cool' }} <br />
          suppressErrors (not cool): {{ 'suppressErrors' | doCan: 'not cool' }}
          <br />
          suppressErrorsNot (cool): {{ 'suppressErrors' | doCan: 'cool' }}
          <br />
          suppressErrorsNot (not cool):
          {{ 'suppressErrors' | doCan: 'not cool' }} <br />
        </blockquote>
      </do-provide-rules>
    </do-provide-rules>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepComponent {
  public static deepRules = doCreatRuleSet({
    EXTENDED_RULE: [
      HelloComponent.inheritedRules.inherited_ADMIN_CAN,
      ([arg1]) => arg1 === 10,
    ],
    CHAINED_RULE: [
      'CHAIN_WITH_STRING_RULE',
      (args) => {
        return args[0] === 'cool';
      },
    ],
    CHAINED_GLOBAL_RULE: [
      'CHAIN_GLOBAL_WITH_STRING_RULE',
      (args) => {
        return args[0] === 'cool';
      },
    ],
    CHAINED_RULE_NOT: [
      doNot('CHAIN_WITH_STRING_RULE'),
      (args) => {
        return args[0] === 'cool';
      },
    ],
  });
  public static suppressErrors = doCreatRuleSet(
    {
      suppressErrors: [
        'CHAIN_WITH_STRING_RULE_NOT_DEFINED_YET',
        (args) => {
          return args[0] === 'cool';
        },
      ],
      suppressErrorsNot: [
        doNot('CHAIN_WITH_STRING_RULE_NOT_DEFINED_YET'),
        (args) => {
          return args[0] === 'cool';
        },
      ],
    },
    { absentRuleBehavior: DoAbsentRuleBehavior.warnings }
  );
  public static overrideRules = doCreatRule([() => false], 'GUEST_CAN');

  deepRules = { ...DeepComponent.deepRules, ...DeepComponent.suppressErrors };
  overrideRules = DeepComponent.overrideRules;
}
