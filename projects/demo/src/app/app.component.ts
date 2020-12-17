import { appActions } from './store/app.actions';
import { selectCurrentUserId } from './store/app.selectors';
import { AppState } from './store/app.reducer';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public userId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserId)
  );

  constructor(private readonly store: Store<AppState>) {}

  onLogout() {
    this.store.dispatch(appActions.logout());
  }
}
