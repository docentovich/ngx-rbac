import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-route2',
  template: `
    <h1>route 2</h1>
    <hr />
    <a routerLink="/">home</a><br />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Route2Component {}
