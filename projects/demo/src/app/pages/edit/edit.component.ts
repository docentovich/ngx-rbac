import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Status } from './../../models/user';
import { appActions } from './../../store/app.actions';
import { AppState } from './../../store/app.reducer';
import { selectUserEntities } from './../../store/app.selectors';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public status = Status;
  public userId: string;

  private subscriptions: Subscription = new Subscription();
  constructor(
    private readonly store: Store<AppState>,
    private readonly ar: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.userId = this.ar.snapshot.params.userId;
    console.log('this.userId', this.userId);
    if (this.userId) {
      this.subscriptions.add(
        this.store.select(selectUserEntities).subscribe((users) => {
          const user = users[this.userId];
          console.log('user', user);
          if (user) {
            this.formGroup = new FormGroup({
              name: new FormControl(user.name, Validators.required),
              status: new FormControl(user.status),
            });
          }
        })
      );
    } else {
      this.formGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        status: new FormControl(this.status.authorized),
      });
    }
  }

  ngOnDestroy() {
    console.log('destroy');
    this.subscriptions.unsubscribe();
  }

  onSubmit() {
    if (this.userId) {
      this.store.dispatch(
        appActions.editUser({
          payload: {
            id: this.userId,
            name: this.formGroup.get('name').value,
            status: this.formGroup.get('status').value,
          },
        })
      );
    } else {
      this.store.dispatch(
        appActions.addUser({
          payload: {
            id: `${Math.random()}`,
            name: this.formGroup.get('name').value,
            status: this.formGroup.get('status').value,
          },
        })
      );
    }
  }
}
