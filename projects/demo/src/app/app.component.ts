import { moderatorRole } from './rbac/roles';
import { canSeeUserListPermission, AppPermissions } from './rbac/permissions';
import { DoRoleType } from './../../../ngx-rbac/src/lib/type/do-role-type';
import { AppRules, ruleSet } from './rbac/rules';
import { appActions } from './store/app.actions';
import {
  selectCurrentUserId,
  selectCurrentUserRoles,
} from './store/app.selectors';
import { AppState } from './store/app.reducer';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DoGlobalRulesService } from '@doce/ngx-rbac';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public userRoles$: Observable<DoRoleType[]> = this.store.pipe(
    select(selectCurrentUserRoles),
    tap(console.log)
  );
  public userId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserId)
  );
  public canSeeUserListPermission = canSeeUserListPermission;
  public appPermissions: typeof AppPermissions = AppPermissions;
  public appRules: typeof AppRules = AppRules;

  constructor(
    private readonly store: Store<AppState>,
    private readonly doGlobalRulesService: DoGlobalRulesService
  ) {
    this.doGlobalRulesService.addGlobalRules(ruleSet); // Add global Rules to the pull of global rules
    this.store.dispatch(
      appActions.addUser({
        payload: {
          id: '1',
          name: 'Moderator',
          roles: [moderatorRole],
          deleted: false,
        },
      })
    );
  }

  onLogout() {
    this.store.dispatch(appActions.logout());
  }
}
