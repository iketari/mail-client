import { Action } from '@ngrx/store';
import { IEmail } from '../../../shared/models/email';

export enum CoreActionTypes {
  LoadEmails = '[Core] Load Emails',
  LoadEmailsSuccess = '[Core] Load Emails Success',
  LoadEmailsFail = '[Core] Load Emails Fail'
}

export class LoadEmails implements Action {
  readonly type = CoreActionTypes.LoadEmails;
}

export class LoadEmailsSuccess implements Action {
  readonly type = CoreActionTypes.LoadEmailsSuccess;
  constructor(public payload: IEmail[]) {}
}

export class LoadEmailsFail implements Action {
  readonly type = CoreActionTypes.LoadEmailsFail;
  constructor(public payload: any) {}
}

export type CoreActions = LoadEmails
  | LoadEmailsSuccess
  | LoadEmailsFail;
