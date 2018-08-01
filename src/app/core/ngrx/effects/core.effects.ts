import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CoreActions, CoreActionTypes, LoadEmails, LoadEmailsSuccess, LoadEmailsFail } from '../actions/core.actions';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { EmailService } from '../../services/email.service';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import * as fromCore from '../reducers';

@Injectable()
export class CoreEffects {

  @Effect()
  public loadEmails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmails>(CoreActionTypes.LoadEmails),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      return this.emailService.getPaginatedEmails(action.payload.page, state.core.emails.limit)
    }),
    map((emails) => new LoadEmailsSuccess(emails)),
    catchError((err) => of(new LoadEmailsFail(err)))
  )

  constructor(
    private actions$: Actions,
    private emailService: EmailService,
    private store: Store<fromCore.State>
  ) {}
}
