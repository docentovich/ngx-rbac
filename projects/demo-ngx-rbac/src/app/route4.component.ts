import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-route4',
  template: `
    <h1>route 4</h1>
    <hr />
    <a routerLink="/">home</a><br />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Route4Component {}
