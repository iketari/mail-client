import { Action } from '@ngrx/store';
import { IEmail } from '../../../shared/models/message';
import { IListResult } from '../../../shared/models/listresult';
import { ISearchQuery, ISearchResult } from '../../../shared/models/search';

export enum SearchActionTypes {
  LoadSearchResults = '[Search] Load Results',
  LoadSearchResultsSuccess = '[Search] Load Results Success',
  LoadSearchResultsFail = '[Search] Load Results Fail'
}

export class LoadSearchResults implements Action {
  readonly type = SearchActionTypes.LoadSearchResults;
  constructor(public payload: { page: number; params?: Partial<ISearchQuery> }) {}
}

export class LoadSearchResultsSuccess implements Action {
  readonly type = SearchActionTypes.LoadSearchResultsSuccess;
  constructor(public payload: IListResult<ISearchResult<IEmail>>) {}
}

export class LoadSearchResultsFail implements Action {
  readonly type = SearchActionTypes.LoadSearchResultsFail;
  constructor(public payload: any) {}
}

export type SearchActions = LoadSearchResults | LoadSearchResultsSuccess | LoadSearchResultsFail;
