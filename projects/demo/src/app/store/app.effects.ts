import { appActions } from './app.actions';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { Actions, createEffect } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AppEffects {
  // onLogout$: Observable<Action> = createEffect(
  //   this.actions$.pipe(
  //     ofType(appActions.logout),
  //     switchMap(
  //       () => this.router.navigate(['login'])
  //     )
  //   )
  // );

  constructor(private readonly actions$: Actions, private readonly router: Router) {}
}
