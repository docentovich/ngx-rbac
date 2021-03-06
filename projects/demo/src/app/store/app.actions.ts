import { User } from './../models/user';
import { createAction, props } from "@ngrx/store";

enum AppActions {
  AddUser = '[App] Add User',
  EditUser = '[App] Edit User',
  DeleteUser = '[App] Delete User',
  RestoreUser = '[App] Restore User',
  login = '[App] Login',
  logout = '[App] Logout',
}

const addUser = createAction(AppActions.AddUser, props<{
  payload: User
}>());

const editUser = createAction(
  AppActions.EditUser,
  props<{
    payload: User;
  }>()
);

const deleteUser = createAction(
  AppActions.DeleteUser,
  props<{
    payload: string;
  }>()
);

const restoreUser = createAction(
  AppActions.RestoreUser,
  props<{
    payload: string;
  }>()
);

const login = createAction(
  AppActions.login,
  props<{
    payload: User
  }>()
);

const logout = createAction(
  AppActions.logout
);

export const appActions = {
  addUser,
  editUser,
  deleteUser,
  restoreUser,
  login,
  logout
};
