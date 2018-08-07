import { Action } from '@ngrx/store';
import { IEmail } from '../../../shared/models/message';
import { ISearchQuery, ISearchResponse, IParticipant } from '../../../shared/models/search';

export enum SearchActionTypes {
  LoadSearchResults = '[Search] Load Results',
  LoadSearchResultsSuccess = '[Search] Load Results Success',
  LoadSearchResultsFail = '[Search] Load Results Fail',
  SelectSearchResult = '[Search] Select Result',
  ChangeSearchParticipantsParams = '[Search] Change Participants Params',
  ChangeSearchDatesParams = '[Search] Change Date Params',
  ChangeSearchTextQuery = '[Search] Change Text Query'
}

export class LoadSearchResults implements Action {
  readonly type = SearchActionTypes.LoadSearchResults;
  constructor(public payload: { page: number; params?: Partial<ISearchQuery> }) {}
}

export class LoadSearchResultsSuccess implements Action {
  readonly type = SearchActionTypes.LoadSearchResultsSuccess;
  constructor(public payload: ISearchResponse<IEmail>) {}
}

export class LoadSearchResultsFail implements Action {
  readonly type = SearchActionTypes.LoadSearchResultsFail;
  constructor(public payload: any) {}
}

export class SelectResult implements Action {
  readonly type = SearchActionTypes.SelectSearchResult;
  constructor(public payload: { id: string }) {}
}

export class ChangeSearchParticipantsParams implements Action {
  readonly type = SearchActionTypes.ChangeSearchParticipantsParams;
  constructor(public payload: { from?: IParticipant; to?: IParticipant[] }) {}
}

export class ChangeSearchDatesParams implements Action {
  readonly type = SearchActionTypes.ChangeSearchDatesParams;
  constructor(public payload: { date_from?: Date; date_to?: Date }) {}
}

export class ChangeSearchTextQuery implements Action {
  readonly type = SearchActionTypes.ChangeSearchTextQuery;
  constructor(public payload: { query: string }) {}
}

export type SearchActions =
  | LoadSearchResults
  | LoadSearchResultsSuccess
  | LoadSearchResultsFail
  | SelectResult
  | ChangeSearchParticipantsParams
  | ChangeSearchDatesParams
  | ChangeSearchTextQuery;
