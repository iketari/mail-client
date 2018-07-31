import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CoreActions, CoreActionTypes, LoadEmails, LoadEmailsSuccess, LoadEmailsFail } from '../actions/core.actions';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { EmailService } from '../../services/email.service';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class CoreEffects {

  @Effect()
  public loadEmails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmails>(CoreActionTypes.LoadEmails),
    switchMap(() => this.emailService.getEmais()),
    map((emails) => new LoadEmailsSuccess(emails)),
    catchError((err) => of(new LoadEmailsFail(err)))
  )

  constructor(
    private actions$: Actions,
    private emailService: EmailService
  ) {}
}
