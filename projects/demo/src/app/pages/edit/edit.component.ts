import { DoRoleType } from './../../../../../ngx-rbac/src/lib/type/do-role-type';
import { Roles, authorizedRole, moderatorRole, restoratorRole } from './../../rbac/roles';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
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
  public roles: typeof Roles = Roles;
  public userId: string;
  public authorized: DoRoleType = authorizedRole;
  public moderator: DoRoleType = moderatorRole;
  public restoratorRole: DoRoleType = restoratorRole;
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
          const user = users[this.userId];
          console.log('user', user);
          if (user) {
            this.formGroup = new FormGroup({
              name: new FormControl(user.name, Validators.required),
              deleted: new FormControl(user.deleted),
              roles: new FormControl([...user.roles], Validators.required),
            });
          }
        })
      );
    } else {
      this.formGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        deleted: new FormControl(false),
        roles: new FormControl(this.roles.authorized, Validators.required),
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
            deleted: this.formGroup.get('deleted').value,
            roles: this.formGroup.get('roles').value,
          },
        })
      );
    } else {
      this.store.dispatch(
        appActions.addUser({
          payload: {
            id: `${Math.floor(Math.random() * 10000)}`,
            name: this.formGroup.get('name').value,
            deleted: this.formGroup.get('deleted').value,
            roles: this.formGroup.get('roles').value,
          },
        })
      );
    }
  }
}
