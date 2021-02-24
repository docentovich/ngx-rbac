import { DoGlobalRulesService } from '@doce/ngx-rbac';
import { appActions } from './app.actions';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Roles } from '../rbac/roles';

@Injectable()
export class AppEffects {
  onLogout$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.logout),
      tap(
        () => {
          console.log('logout');
          // this.doGlobalRulesService.changeRoles(null);
        }
      )
    ), {
      dispatch: false
    }
  );

  constructor(private readonly actions$: Actions, private readonly router: Router,
    private readonly doGlobalRulesService: DoGlobalRulesService) {}
}
