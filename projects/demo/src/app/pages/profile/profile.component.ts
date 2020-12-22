import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from './../../models/user';
import { appActions } from './../../store/app.actions';
import { AppState } from './../../store/app.reducer';
import { selectUserEntities } from './../../store/app.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userId: string;
  public user: User;

  private subscriptions: Subscription = new Subscription();
  constructor(
    private readonly store: Store<AppState>,
    private readonly ar: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.ar.snapshot.params.userId;
    console.log('this.userId', this.userId);
    if (this.userId) {
      this.subscriptions.add(
        this.store.select(selectUserEntities).subscribe((users) => {
          this.user = users[this.userId];
        })
      );
    } else {
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onDelete(userId: string): void {
    this.store.dispatch(appActions.deleteUser({ payload: userId }));
  }

  public onRestore(userId: string): void {
    this.store.dispatch(appActions.restoreUser({ payload: userId }));
  }
}
