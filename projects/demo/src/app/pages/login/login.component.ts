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

  constructor(private readonly store: Store<AppState>) {}

  public loginAsUser(userId: string): void {
    this.store.dispatch(appActions.login({ payload: userId }));
  }

  public loginAsModerator(): void {
    // this.store.dispatch(appActions.login({ payload: userId }));
  }
}
