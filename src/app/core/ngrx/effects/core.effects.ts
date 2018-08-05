import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  CoreActions,
  CoreActionTypes,
  LoadEmail,
  LoadEmailSuccess,
  LoadEmailFail
} from '../actions/core.actions';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { EmailService } from '../../services/email.service';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import * as fromCore from '../reducers';
import {
  LoadSearchResults,
  SearchActionTypes,
  LoadSearchResultsSuccess,
  LoadSearchResultsFail
} from '../actions/search.actions';
import { ISearchResult } from '../../../shared/models/search';
import { IEmail } from '../../../shared/models/message';
import { IListResult } from '../../../shared/models/listresult';

@Injectable()
export class CoreEffects {
  @Effect()
  public loadEmail$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmail>(CoreActionTypes.LoadEmail),
    switchMap(({ payload }) => {
      return this.emailService.getEmail(payload.id);
    }),
    map((email: IEmail) => {
      return new LoadEmailSuccess(email);
    }),
    catchError((err) => of(new LoadEmailFail(err)))
  );

  @Effect()
  public loadSearchParams$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSearchResults>(SearchActionTypes.LoadSearchResults),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      const { params, page } = action.payload;
      return this.emailService.search(params || {}, page, state.core.search.limit);
    }),
    map((results: IListResult<ISearchResult<IEmail>>) => {
      return new LoadSearchResultsSuccess(results);
    }),
    catchError((err) => of(new LoadSearchResultsFail(err)))
  );

  constructor(
    private actions$: Actions,
    private emailService: EmailService,
    private store: Store<fromCore.State>
  ) {}
}
