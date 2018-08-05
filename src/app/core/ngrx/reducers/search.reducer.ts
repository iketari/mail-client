import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CoreActions, CoreActionTypes } from '../actions/core.actions';
import { IEmail } from '../../../shared/models/message';
import { ISearchResult } from '../../../shared/models/search';
import { SearchActionTypes, SearchActions } from '../actions/search.actions';

import cloneDeep from 'lodash/cloneDeep';

export interface State extends EntityState<ISearchResult<IEmail>> {
  selected: ISearchResult<IEmail>;
  loading: boolean;
  total: number;
  page: number;
  limit: number;
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
  limit: 10
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

    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selected;
export const getTotal = (state: State) => state.total;
export const getPage = (state: State) => state.page;
export const getLimit = (state: State) => state.limit;
