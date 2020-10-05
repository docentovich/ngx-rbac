import { Optional, Pipe, PipeTransform, SkipSelf } from '@angular/core';
import { DoProvideRulesComponent } from '../component/do-provide-rules.component';
import { DoRuleType } from '../type/do-rule-type';

@Pipe({
  name: 'doCan',
})
export class DoCanPipe implements PipeTransform {
  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent
  ) {}

  transform(value: DoRuleType, ...args: any[]): any {
    debugger;
    return this.source?.provideRulesService.can(value, args);
  }
}
