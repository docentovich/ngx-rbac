import {
  ChangeDetectorRef,
  OnDestroy,
  Optional,
  Pipe,
  PipeTransform,
  SkipSelf,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DoProvideRulesComponent } from '../component/do-provide-rules.component';
import { AllPossibleCheckers } from '../type/do-checker-function';
import { DoRule } from '../model/do-rule';
import { DoRuleType } from '../type/do-rule-type';

@Pipe({
  name: 'doCan',
  pure: false,
})
export class DoCanPipe implements PipeTransform, OnDestroy {
  private destroy$ = new Subject<void>();
  private markForTransform = true;
  private value: boolean;

  constructor(
    @Optional()
    @SkipSelf()
    private source: DoProvideRulesComponent,
    @Optional()
    @SkipSelf()
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (!source?.provideRulesService) {
      return;
    }
    this.source?.provideRulesService.changes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((providerKey) => {
        this.markForTransform = true;
        this.changeDetectorRef.markForCheck();
      });
  }

  transform(
    rule: string | AllPossibleCheckers[] | AllPossibleCheckers | DoRuleType,
    ...args: any[]
  ): any {
    if (!this.markForTransform) {
      return this.value;
    }
    if (!(typeof rule === 'string' || (rule as any) instanceof DoRule)) {
      throw Error('Transformed value must be string or DoChecker type but get: ' + typeof rule);
    }
    // todo drop error if no provider
    this.value = this.source?.provideRulesService.can(rule.toString(), args);
    this.markForTransform = false;
    return this.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
