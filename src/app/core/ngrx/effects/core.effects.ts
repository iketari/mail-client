import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of, from } from 'rxjs';
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
  ChangeSearchTextQuery,
  ChangeSearchDatesParams
} from '../actions/search.actions';
import { ISearchResponse, IParticipant } from '../../../shared/models/search';
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
    ofType<ChangeSearchParticipantsParams | ChangeSearchTextQuery | ChangeSearchDatesParams>(
      SearchActionTypes.ChangeSearchParticipantsParams,
      SearchActionTypes.ChangeSearchTextQuery,
      SearchActionTypes.ChangeSearchDatesParams
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

      return this.emailService.searchThreads(params, page, state.core.search.limit);
    }),
    switchMap((results: ISearchResponse<IEmail>) => {
      return from([
        new LoadSearchResultsSuccess(results),
        new LoadParticipantsSuccess(results.participants)
      ]);
    }),
    catchError((err) => of(new LoadSearchResultsFail(err)))
  );

  constructor(
    private actions$: Actions,
    private emailService: EmailService,
    private store: Store<fromCore.State>
  ) {}
}
