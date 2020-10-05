import { Component, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { DoProvideRulesComponent } from '@do/ngx-rbac';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-route1',
  template: `
    <h1>route 1</h1>
    <hr />
    <a routerLink='/'>home</a><br>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `,
  ],
})
export class Route1Component implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();

  constructor(
    @Optional()
    @SkipSelf()
    public source: DoProvideRulesComponent
  ) {}


  ngOnInit(): void {
    this.source?.provideRulesService
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userRoles, can }) => {
        console.log(
          userRoles[0]?.name + ' can GUARD_RULE ' + can('GUARD_RULE')
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
