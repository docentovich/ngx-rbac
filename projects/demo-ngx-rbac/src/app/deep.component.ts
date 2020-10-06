import { ChangeDetectionStrategy, Component } from '@angular/core';
import { creatRule, Dictionary, DoRuleType } from '@do/ngx-rbac';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'app-deep',
  template: `
    <h3>Deep</h3>
    <do-provide-rules [rules]="deepRules">
      <blockquote>
        EXTENDED_RULE 5,5: {{ 'EXTENDED_RULE' | doCan: 5:5 }}<br />
        EXTENDED_RULE 5,10: {{ 'EXTENDED_RULE' | doCan: 5:10 }}<br />
        EXTENDED_RULE 10,10: {{ 'EXTENDED_RULE' | doCan: 10:10 }}<br /><br /><br />
        overrideRules GUEST_CAN: {{ 'GUEST_CAN' | doCan }}<br />
      </blockquote>
    </do-provide-rules>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepComponent {
  public static deepRules: Dictionary<DoRuleType> = {
    EXTENDED_RULE: creatRule([
      HelloComponent.inheritedRules.inherited_ADMIN_CAN,
      ([arg1]) => arg1 === 10,
    ]),
  };
  public static overrideRules: Dictionary<DoRuleType> = {
    GUEST_CAN: creatRule([() => false]),
  };

  deepRules = { ...DeepComponent.deepRules, ...DeepComponent.overrideRules };
}
