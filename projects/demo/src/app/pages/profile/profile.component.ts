import { ActivatedRoute } from '@angular/router';
import { selectUserEntities } from './../../store/app.selectors';
import { appActions } from './../../store/app.actions';
import { AppState } from './../../store/app.reducer';
import { User, Status } from './../../models/user';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userId: string;
  public user: User;
  public status = Status;

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
