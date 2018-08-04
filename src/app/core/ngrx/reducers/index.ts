import {
  createSelector,
  createFeatureSelector,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import * as fromEmails from './emails.reducer';
import * as fromRoot from '../../../reducers';

export interface CoreState {
  emails: fromEmails.State;
}

export interface State extends fromRoot.State {
  core: CoreState;
}

export const reducers: ActionReducerMap<CoreState> = {
  emails: fromEmails.reducer
};

export const getCoreState = createFeatureSelector<CoreState>('core');

export const getEmailsEntitiesState = createSelector(getCoreState, (state) => state.emails);

export const {
  selectIds: getEmailIds,
  selectEntities: getEmailEntities,
  selectAll: getAllEmails
} = fromEmails.adapter.getSelectors(getEmailsEntitiesState);

export const getTotalEmails = createSelector(getCoreState, (state) => state.emails.total);

export const getCurrentEmailsPage = createSelector(getCoreState, (state) => state.emails.page);

export const getEmailsLimit = createSelector(getCoreState, (state) => state.emails.limit);

export const getEmailsLoading = createSelector(getEmailsEntitiesState, fromEmails.getLoading);
