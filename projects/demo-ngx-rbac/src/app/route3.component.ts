import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-route3',
  template: `
    <h1>route 3</h1>
    <hr />
    <a routerLink="/">home</a><br />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Route3Component {}
