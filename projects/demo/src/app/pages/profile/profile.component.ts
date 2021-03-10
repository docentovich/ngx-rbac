// RBAC
import { AppPermissions } from './../../rbac/permissions';
import { AppRules } from './../../rbac/rules';

// Store
import { Store } from '@ngrx/store';
import { appActions } from './../../store/app.actions';
import { AppState } from './../../store/app.reducer';
import { selectUserEntities } from './../../store/app.selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userId: string;
  public user: User;
  public appPermissions: typeof AppPermissions = AppPermissions;
  public appRules: typeof AppRules = AppRules;

  private subscriptions: Subscription = new Subscription();
  constructor(
    private readonly store: Store<AppState>,
    private readonly ar: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.ar.snapshot.params.userId;
    if (this.userId) {
      this.subscriptions.add(
        this.store.select(selectUserEntities).subscribe((users) => {
          this.user = users[this.userId];
        })
      );
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
