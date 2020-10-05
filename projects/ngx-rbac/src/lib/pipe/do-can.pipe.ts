import {
  ChangeDetectorRef,
  OnDestroy,
  Optional,
  Pipe,
  PipeTransform,
  SkipSelf,
} from '@angular/core';
import { DoProvideRulesComponent } from '../component/do-provide-rules.component';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Pipe({
  name: 'doCan',
  pure: false,
})
export class DoCanPipe implements PipeTransform, OnDestroy {
  protected destroy$ = new Subject<void>();
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
    this.source?.provideRulesService
      .pipe(
        takeUntil(this.destroy$),
        filter(({ rules, userRoles }) => !!(rules || userRoles))
      )
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
