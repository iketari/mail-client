import {
  createSelector,
  createFeatureSelector,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import * as fromEmails from './emails.reducer';
import * as fromSearch from './search.reducer';
import * as fromRoot from '../../../reducers';

export interface CoreState {
  emails: fromEmails.State;
  search: fromSearch.State;
}

export interface State extends fromRoot.State {
  core: CoreState;
}

export const reducers: ActionReducerMap<CoreState> = {
  emails: fromEmails.reducer,
  search: fromSearch.reducer
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

// search selectors
export const getSearchResultsEntitiesState = createSelector(getCoreState, (state) => state.search);

export const {
  selectIds: getSearchResultIds,
  selectEntities: getSearchResultEntities,
  selectAll: getAllSearchResults
} = fromSearch.adapter.getSelectors(getSearchResultsEntitiesState);

export const getTotalSearchResults = createSelector(getCoreState, (state) => state.search.total);
export const getCurrentSearchResultsPage = createSelector(
  getCoreState,
  (state) => state.search.page
);
export const getSearchResultsLimit = createSelector(getCoreState, (state) => state.search.limit);

export const getSearchResultsLoading = createSelector(
  getSearchResultsEntitiesState,
  fromSearch.getLoading
);
