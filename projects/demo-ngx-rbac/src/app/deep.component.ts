import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelloComponent } from './hello.component';
import { creatRuleSet, creatRule } from '@do/ngx-rbac';

@Component({
  selector: 'app-deep',
  template: `
    <h3>Deep</h3>
    <do-provide-rules [rules]="deepRules">
      <do-provide-rules [rules]="overrideRules">
        <blockquote>
          EXTENDED_RULE 5,5: {{ deepRules.EXTENDED_RULE | doCan: 5:5 }}<br />
          EXTENDED_RULE 5,10: {{ 'EXTENDED_RULE' | doCan: 5:10 }}<br />
          EXTENDED_RULE 10,10: {{ deepRules.EXTENDED_RULE | doCan: 10:10
          }}<br /><br /><br />
          overrideRules GUEST_CAN: {{ overrideRules.GUEST_CAN | doCan }}<br />
        </blockquote>
      </do-provide-rules>
    </do-provide-rules>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepComponent {
  public static deepRules = creatRuleSet({
    EXTENDED_RULE: [
      HelloComponent.inheritedRules.inherited_ADMIN_CAN,
      ([arg1]) => arg1 === 10,
    ],
  });
  public static overrideRules = {
    GUEST_CAN: creatRule([() => false]),
  };

  deepRules = DeepComponent.deepRules;
  overrideRules = DeepComponent.overrideRules;
}
