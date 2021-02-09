import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromUser from './app.reducer';

export interface State {
  users: fromUser.AppState;
}

export const reducers: ActionReducerMap<State> = {
  users: fromUser.reducer,
};

export const selectUserState = createFeatureSelector<fromUser.AppState>('app');

export const selectUserIds = createSelector(
  selectUserState,
  fromUser.selectUserIds
);

export const selectUserEntities = createSelector(
  selectUserState,
  fromUser.selectUserEntities
);

export const selectAllUsers = createSelector(
  selectUserState,
  fromUser.selectAllUsers
);

export const selectCurrentUserId = createSelector(
  selectUserState,
  fromUser.getCurrentUserId
);

export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectCurrentUserId,
  (userEntities, userId) => userEntities[userId]
);

export const selectCurrentUserRoles = createSelector(
  selectCurrentUser,
  (user) => user?.roles
);
