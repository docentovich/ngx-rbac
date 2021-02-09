
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from '@ngrx/store';
import { User } from './../models/user';
import { appActions } from './app.actions';


export interface AppState extends EntityState<User> {
  currentUserId: string | null;
}

export function selectUserId(a: User): string {
  return a.id;
}

export function sortByName(a: User, b: User): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: selectUserId,
  sortComparer: sortByName,
});

export const getCurrentUserId = (state: AppState) => state.currentUserId;

const {
  selectIds,
  selectEntities,
  selectAll
} = adapter.getSelectors();


export const selectUserIds = (state) => {
  return selectIds(state);
}

export const selectUserEntities = (state) => {
  return selectEntities(state);
};

export const selectAllUsers = (state) => {
  return selectAll(state);
};

export const initialState: AppState = adapter.getInitialState({
  currentUserId: null,
});

const userReducer = createReducer(
  initialState,
  on(appActions.addUser, (state, { payload }) => {
    return adapter.addOne(payload, state);
  }),
  on(appActions.editUser, (state, { payload }) => {
    return adapter.upsertOne(payload, state);
  }),
  on(appActions.deleteUser, (state, { payload }) => {
    return adapter.updateOne({ id: payload, changes: { deleted: true }}, state);
  }),
  on(appActions.restoreUser, (state, { payload }) => {
    return adapter.updateOne(
      { id: payload, changes: { deleted: false } },
      state
    );
  }),
  on(appActions.login, (state, { payload }) => {
    return {...state, currentUserId: payload }
  }),
  on(appActions.logout, (state) => {
    return {...state, currentUserId: null }
  })
);


export function reducer(state: AppState | undefined, action: Action) {
  return userReducer(state, action);
}
