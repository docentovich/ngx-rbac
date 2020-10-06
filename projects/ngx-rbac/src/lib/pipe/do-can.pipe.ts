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
import { AllPossibleCheckers } from '../type/checker-function';
import { DoChecker } from '../checker/do-checker';

@Pipe({
  name: 'doCan',
  pure: false,
})
export class DoCanPipe implements PipeTransform, OnDestroy {
  private destroy$ = new Subject<void>();
  private markForTransform = true;
  private value: string;

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
    rule: string | AllPossibleCheckers[] | AllPossibleCheckers,
    ...args: any[]
  ): any {
    if (!this.markForTransform) {
      return this.value;
    }
    if (!(typeof rule === 'string' || (rule as any) instanceof DoChecker)) {
      throw Error('Transformed value must be string or DoChecker type but get: ' + typeof rule);
    }
    this.value = this.source?.provideRulesService.can(rule.toString(), args);
    this.markForTransform = false;
    return this.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
