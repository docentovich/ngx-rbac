import { Component, Optional, SkipSelf } from '@angular/core';

import { DoProvideRulesComponent } from '../component/do-provide-rules.component';
import { DoGlobalRulesService } from '../service/do-global-rules.service';

@Component({
  selector: 'do-debug',
  template: `
    <hr />
    <h2>Roles:</h2>
    <strong>All:</strong>
    {{ (this.source.provideRulesService.changes$ | async).roles.join(' -> ') }}
    <br />
    <br />
    <strong>Global:</strong>
    {{ (this.globalRulesService.changes$ | async).roles.join(' -> ') }}
    <br />
    <br />
    <strong>Local:</strong>
    {{ (this.source.provideRulesService.roles$ | async).join(' -> ') }}
    <hr />
    <div (click)="showPermissions = !showPermissions" style="cursor: pointer">
      <h2>Permissions:</h2>
      <div [class.hide]="!showPermissions">
        <strong>Global:</strong>
        <pre>{{ this.globalRulesService.permitted$ | async | json }}</pre>
        <br />
        <strong>Local:</strong>
        <pre>{{
          this.source.provideRulesService.permitted$ | async | json
        }}</pre>
      </div>
    </div>
    <hr />
    <div (click)="showRules = !showRules" style="cursor: pointer">
      <h2>Rules:</h2>
      <div [class.hide]="!showRules">
        <strong>Global:</strong>
        <pre>{{ this.globalRulesService.rules$ | async | json }}</pre>
        <br />
        <strong>Local:</strong>
        <pre>{{ this.source.provideRulesService.rules$ | async | json }}</pre>
      </div>
    </div>
  `,
  styles: ['.hide { display: none; }'],
})
export class DoDebugComponent {
  showRules = false;
  showPermissions = false;
  constructor(
    @Optional()
    @SkipSelf()
    public source: DoProvideRulesComponent,
    public globalRulesService: DoGlobalRulesService
  ) {}
}
