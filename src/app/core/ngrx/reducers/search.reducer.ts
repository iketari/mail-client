import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IEmail } from '../../../shared/models/message';
import { ISearchResult, ISearchQuery } from '../../../shared/models/search';
import { SearchActionTypes, SearchActions } from '../actions/search.actions';

import cloneDeep from 'lodash/cloneDeep';
import { stat } from 'fs';

export interface State extends EntityState<ISearchResult<IEmail>> {
  selected: ISearchResult<IEmail>;
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  searchQuery: ISearchQuery;
}

export const adapter: EntityAdapter<ISearchResult<IEmail>> = createEntityAdapter<
  ISearchResult<IEmail>
>({
  selectId: (item: ISearchResult<IEmail>) => item.originalItem.id
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

    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selected;
export const getTotal = (state: State) => state.total;
export const getPage = (state: State) => state.page;
export const getLimit = (state: State) => state.limit;
