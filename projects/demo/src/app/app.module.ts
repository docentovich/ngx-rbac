import { AppEffects } from './store/app.effects';
import { DoNgxRbacModule } from '@doce/ngx-rbac';
import { Route, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ListComponent } from './pages/list/list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditComponent } from './pages/edit/edit.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './store/app.reducer';
import { ReactiveFormsModule } from '@angular/forms';
import { Effect, EffectsModule } from '@ngrx/effects';

const routes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent
  },
  {
    path: 'create',
    component: EditComponent
  },
  {
    path: 'edit/:userId',
    component: EditComponent
  },
]

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
