// RBAC
import { moderatorRole, unauthorizedRole } from './rbac/roles';
import { canSeeUserListPermission, AppPermissions } from './rbac/permissions';
import { AppRules, ruleSet } from './rbac/rules';
import { DoGlobalRulesService, DoRoleType } from '@doce/ngx-rbac';

// Store
import { appActions } from './store/app.actions';
import {
  selectCurrentUserId,
  selectCurrentUserRoles,
} from './store/app.selectors';
import { AppState } from './store/app.reducer';
import { select, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public userRoles$: Observable<DoRoleType[]> = this.store.pipe(
    select(selectCurrentUserRoles),
  );
  public userId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserId)
  );
  public canSeeUserListPermission = canSeeUserListPermission;
  public appPermissions: typeof AppPermissions = AppPermissions;
  public appRules: typeof AppRules = AppRules;
  public debugOn: boolean = false;

  constructor(
    private readonly store: Store<AppState>,
    private readonly doGlobalRulesService: DoGlobalRulesService
  ) {
    this.doGlobalRulesService.addGlobalRules(ruleSet); // Add global Rules to the pull of global rules
    this.doGlobalRulesService.changeRoles([unauthorizedRole]);
    // create user with role moderator
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
