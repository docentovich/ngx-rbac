import { Optional, Pipe, PipeTransform, SkipSelf } from '@angular/core';

import { DoProvideRulesComponent } from '../component/do-provide-rules.component';
import { DoRule } from '../model/do-rule';

@Pipe({
  name: 'doDebug',
  pure: false,
})
export class DoDebugPipe implements PipeTransform {
  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent
  ) {}

  transform(rule: string): any {
    if (!(typeof rule === 'string' || (rule as any) instanceof DoRule)) {
      throw Error(
        'Transformed value must be string or DoChecker type but get: ' +
          typeof rule
      );
    }
    try {
      this.source?.provideRulesService.can(rule.toString(), []);
    } catch (e) {}
    // todo drop error if no provider
    return (
      '<pre>' +
      this.source?.provideRulesService.mergedRulesAndPermissionsValue[
        rule
      ]?.traceNames.join(' <br/>-> ') +
      '</pre>'
    );
  }
}
