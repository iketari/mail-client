import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IEmail } from '../../../shared/models/message';
import { IThreadSearchResult, ISearchQuery } from '../../../shared/models/search';
import { SearchActionTypes, SearchActions } from '../actions/search.actions';

import cloneDeep from 'lodash/cloneDeep';

export interface State extends EntityState<IThreadSearchResult<IEmail>> {
  selected: IThreadSearchResult<IEmail>;
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  searchQuery: ISearchQuery;
}

export const adapter: EntityAdapter<IThreadSearchResult<IEmail>> = createEntityAdapter<
  IThreadSearchResult<IEmail>
>({
  selectId: (item: IThreadSearchResult<IEmail>) => item.id
});

export const initialState: State = adapter.getInitialState({
  selected: null,
  loading: false,
  total: 0,
  page: 0,
  limit: 10,
  searchQuery: {
    from: null,
    to: [],
    date_from: null,
    date_to: null,
    query: null
  }
});

export function reducer(state = initialState, action: SearchActions): State {
  switch (action.type) {
    case SearchActionTypes.LoadSearchResults:
      return {
        ...state,
        loading: true
      };

    case SearchActionTypes.LoadSearchResultsSuccess:
      const { page, limit, total } = action.payload;
      return {
        ...adapter.addAll(action.payload.items, state),
        loading: false,
        page,
        limit,
        total
      };

    case SearchActionTypes.LoadSearchResultsFail:
      return {
        ...initialState,
        limit: state.limit
      };

    case SearchActionTypes.SelectSearchResult:
      let slected = state.entities[action.payload.id];

      return {
        ...state,
        selected: cloneDeep(slected)
      };

    case SearchActionTypes.ChangeSearchParticipantsParams:
      const { to, from } = action.payload;
      let newFrom = state.searchQuery.from;
      let newTo = state.searchQuery.to;

      if (from !== undefined) {
        newFrom = from !== null ? from.email : null;
      }

      if (to !== undefined) {
        newTo = to.map((participant) => participant.email);
      }

      return {
        ...state,
        loading: true,
        searchQuery: {
          ...state.searchQuery,
          from: newFrom,
          to: newTo
        }
      };

    case SearchActionTypes.ChangeSearchTextQuery:
      const { query } = action.payload;

      return {
        ...state,
        loading: true,
        searchQuery: {
          ...state.searchQuery,
          query
        }
      };

    case SearchActionTypes.ChangeSearchDatesParams:
      let newDateFrom = state.searchQuery.date_from;
      let newDateTo = state.searchQuery.date_to;
      const { date_from, date_to } = action.payload;

      if (date_from !== undefined) {
        newDateFrom = date_from !== null ? date_from : null;
      }

      if (date_to !== undefined) {
        newDateTo = date_to !== null ? date_to : null;
      }

      return {
        ...state,
        loading: true,
        searchQuery: {
          ...state.searchQuery,
          date_from: newDateFrom,
          date_to: newDateTo
        }
      };

    case SearchActionTypes.ResetSearch:
      return {
        ...state,
        loading: true,
        searchQuery: {
          ...initialState.searchQuery
        }
      };

    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selected;
export const getTotal = (state: State) => state.total;
export const getPage = (state: State) => state.page;
export const getLimit = (state: State) => state.limit;
export const getSearchQuery = (state: State) => state.searchQuery;
