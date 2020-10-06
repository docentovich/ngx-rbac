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
      });
  }

  transform(ruleName: string, ...args: any[]): any {
    if (!this.markForTransform) {
      return this.value;
    }
    this.value = this.source?.provideRulesService.can(ruleName, args);
    this.markForTransform = false;
    return this.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
