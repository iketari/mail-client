import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { EmailService } from '../../services/email.service';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import * as fromCore from '../reducers';
import {
  LoadSearchResults,
  SearchActionTypes,
  LoadSearchResultsSuccess,
  LoadSearchResultsFail,
  ChangeSearchParticipantsParams,
  ChangeSearchTextQuery
} from '../actions/search.actions';
import { ISearchResult, IParticipant } from '../../../shared/models/search';
import { IEmail } from '../../../shared/models/message';
import { IListResult } from '../../../shared/models/listresult';
import {
  LoadParticipants,
  ContextActionTypes,
  LoadParticipantsSuccess,
  LoadParticipantsFail
} from '../actions/context.actions';

@Injectable()
export class CoreEffects {
  @Effect()
  public changeQuery$: Observable<Action> = this.actions$.pipe(
    ofType<ChangeSearchParticipantsParams | ChangeSearchTextQuery>(
      SearchActionTypes.ChangeSearchParticipantsParams,
      SearchActionTypes.ChangeSearchTextQuery
    ),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      const params = state.core.search.searchQuery;

      return of(new LoadSearchResults({ page: 1, params }));
    }),
    catchError((err) => of(new LoadSearchResultsFail(err)))
  );

  @Effect()
  public search$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSearchResults>(SearchActionTypes.LoadSearchResults),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      const { page } = action.payload;
      const params = state.core.search.searchQuery;
      
      return this.emailService.search(params, page, state.core.search.limit);
    }),
    map((results: IListResult<ISearchResult<IEmail>>) => {
      return new LoadSearchResultsSuccess(results);
    }),
    catchError((err) => of(new LoadSearchResultsFail(err)))
  );

  @Effect()
  public participants$: Observable<Action> = this.actions$.pipe(
    ofType<LoadParticipants>(ContextActionTypes.LoadParticipants),
    switchMap((_action) => {
      return this.emailService.getParticipants();
    }),
    map((results: IParticipant[]) => {
      return new LoadParticipantsSuccess(results);
    }),
    catchError((err) => of(new LoadParticipantsFail(err)))
  );

  constructor(
    private actions$: Actions,
    private emailService: EmailService,
    private store: Store<fromCore.State>
  ) {}
}
