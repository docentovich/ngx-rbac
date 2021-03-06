// RBAC
import { DoGlobalRulesService } from '@doce/ngx-rbac';

// Store
import { select, Store } from '@ngrx/store';
import { appActions } from './../../store/app.actions';
import { AppState } from './../../store/app.reducer';
import { selectAllUsers } from './../../store/app.selectors';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public userList$: Observable<User[]> = this.store.pipe(
    select(selectAllUsers)
  );

  constructor(
    private readonly store: Store<AppState>,
    private readonly doGlobalRulesService: DoGlobalRulesService
  ) {}

  public login(user: User): void {
    this.store.dispatch(appActions.login({ payload: user.id }));
    this.doGlobalRulesService.changeRoles([...user.roles]);
  }
}
