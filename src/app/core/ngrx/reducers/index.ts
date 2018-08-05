import {
  createSelector,
  createFeatureSelector,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import * as fromContext from './context.reducer';
import * as fromSearch from './search.reducer';
import * as fromRoot from '../../../reducers';

export interface CoreState {
  search: fromSearch.State;
  context: fromContext.State;
}

export interface State extends fromRoot.State {
  core: CoreState;
}

export const reducers: ActionReducerMap<CoreState> = {
  search: fromSearch.reducer,
  context: fromContext.reducer
};

export const getCoreState = createFeatureSelector<CoreState>('core');

// context selectors
export const getContextEntitiesState = createSelector(getCoreState, (state) => state.context);
export const getSelectedFromParticipant = createSelector(
  getContextEntitiesState,
  (state) => state.selected
);

export const {
  selectIds: getParticipantsIds,
  selectEntities: getParticipantsEntities,
  selectAll: getAllParticipants
} = fromContext.adapter.getSelectors(getContextEntitiesState);

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
