import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { DoGlobalRulesService } from '@doce/ngx-rbac';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { unauthorizedRole } from './../rbac/roles';
import { appActions } from './app.actions';

@Injectable()
export class AppEffects {
  onLogout$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.logout),
      tap(
        () => {
          this.doGlobalRulesService.changeRoles([unauthorizedRole]);
        }
      )
    ), {
      dispatch: false
    }
  );

  onLogin$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.login),
      tap(
        (action) => {
          this.doGlobalRulesService.changeRoles([...action.payload.roles]);
          this.router.navigate(['profile', action.payload.id]);
        }
      )
    ), {
      dispatch: false
    }
  );

  constructor(private readonly actions$: Actions, private readonly router: Router,
    private readonly doGlobalRulesService: DoGlobalRulesService) {}
}
