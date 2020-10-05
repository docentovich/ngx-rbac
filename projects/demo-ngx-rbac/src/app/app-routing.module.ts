import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloComponent } from './hello.component';
import { Route1Component } from './route1.component';
import { DoCanGuard } from '@do/ngx-rbac';


const routes: Routes = [
  {
    path: '',
    component: HelloComponent
  },
  {
    path: 'route1',
    data: {
      rules: ['GUARD_RULE']
    },
    canActivate: [DoCanGuard],
    component: Route1Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
