import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloComponent } from './hello.component';
import { Route1Component } from './route1.component';
import { DoCanGuard } from '@do/ngx-rbac';
import { Route3Component } from './route3.component';


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
  {
    path: 'route2',
    data: {
      rules: ['ONLY_GUEST']
    },
    canActivate: [DoCanGuard],
    component: Route1Component
  },
  {
    path: 'route3',
    data: {
      rules: ['GUEST_and_ADMIN']
    },
    canActivate: [DoCanGuard],
    component: Route3Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
