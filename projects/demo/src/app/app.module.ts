import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { DoCanGuard, DoNgxRbacModule } from '@doce/ngx-rbac';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { EditComponent } from './pages/edit/edit.component';
import { ListComponent } from './pages/list/list.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AppRules, ruleSet } from './rbac/rules';
import { AppEffects } from './store/app.effects';
import { reducer } from './store/app.reducer';


const routes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      rules: [
        AppRules.isUnauthorized,
      ],
    },
    canActivate: [DoCanGuard],
  },
  {
    path: 'list',
    component: ListComponent,
    data: {
      rules: [AppRules.isAuthorized],
    },
    canActivate: [DoCanGuard],
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
    data: {
      rules: [AppRules.isAuthorized],
    },
    canActivate: [DoCanGuard],
  },
  {
    path: 'create',
    component: EditComponent,
    data: {
      rules: [AppRules.isAuthorized],
    },
    canActivate: [DoCanGuard],
  },
  {
    path: 'edit/:userId',
    component: EditComponent,
    data: {
      rules: [AppRules.isAuthorized],
    },
    canActivate: [DoCanGuard],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListComponent,
    ProfileComponent,
    EditComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({ app: reducer }),
    EffectsModule.forRoot([AppEffects]),
    ReactiveFormsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      features: {
        pause: false,
        lock: true,
        persist: true,
      },
    }),
    DoNgxRbacModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
