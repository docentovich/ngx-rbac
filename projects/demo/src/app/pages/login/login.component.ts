import { moderatorRole } from './../../rbac/roles';
import { DoGlobalRulesService } from '@do/ngx-rbac';
import { appActions } from './../../store/app.actions';
import { selectAllUsers } from './../../store/app.selectors';
import { AppState } from './../../store/app.reducer';
import { User } from './../../models/user';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

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

  public login(userId: string): void {
    this.store.dispatch(appActions.login({ payload: userId }));
    console.log(this.doGlobalRulesService.changeRoles);
    this.doGlobalRulesService.changeRoles([moderatorRole]);
  }
}
