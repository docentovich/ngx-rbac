import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './../../models/user';
import { appActions } from './../../store/app.actions';
import { AppState } from './../../store/app.reducer';
import { selectAllUsers } from './../../store/app.selectors';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  public userList$: Observable<User[]> = this.store.pipe(
    select(selectAllUsers)
  );

  constructor(private readonly store: Store<AppState>) {}

  public onDelete(event, userId: string): void {
    event.stopPropagation();
    event.preventDefault();
    this.store.dispatch(appActions.deleteUser({ payload: userId }));
  }

  public onRestore(event, userId: string): void {
    event.stopPropagation();
    event.preventDefault();
    this.store.dispatch(appActions.restoreUser({ payload: userId }));
  }
}
