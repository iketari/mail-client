import {
  createSelector,
  createFeatureSelector,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import * as fromEmails from './emails.reducer';
import * as fromSearch from './search.reducer';
import * as fromRoot from '../../../reducers';
import { ISearchResult } from '../../../shared/models/search';
import { IEmail } from '../../../shared/models/message';

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

// emails selectors
// tode: remove unsed
export const getEmailsState = createSelector(getCoreState, (state) => state.emails);
export const getEmailsLoading = createSelector(getEmailsState, fromEmails.getLoading);

// search selectors
export const getSearchResultsEntitiesState = createSelector(getCoreState, (state) => state.search);

export const {
  selectIds: getSearchResultIds,
  selectEntities: getSearchResultEntities,
  selectAll: getAllSearchResults
} = fromSearch.adapter.getSelectors(getSearchResultsEntitiesState);

export const getTotalSearchResults = createSelector(getCoreState, (state) => state.search.total);
export const getCurrentSearchResultsPage = createSelector(
  getSearchResultsEntitiesState,
  fromSearch.getPage
);
export const getSearchResultsLimit = createSelector(
  getSearchResultsEntitiesState,
  fromSearch.getLimit
);

export const getSearchResultsLoading = createSelector(
  getSearchResultsEntitiesState,
  fromSearch.getLoading
);

export const getSelectedResult = createSelector(
  getSearchResultsEntitiesState,
  fromSearch.getSelected
);
