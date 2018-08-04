import { Action } from '@ngrx/store';
import { IEmail } from '../../../shared/models/message';
import { IListResult } from '../../../shared/models/listresult';

export enum CoreActionTypes {
  LoadEmails = '[Core] Load Emails',
  LoadEmailsSuccess = '[Core] Load Emails Success',
  LoadEmailsFail = '[Core] Load Emails Fail'
}

export class LoadEmails implements Action {
  readonly type = CoreActionTypes.LoadEmails;
  constructor(public payload: { page: number }) {}
}

export class LoadEmailsSuccess implements Action {
  readonly type = CoreActionTypes.LoadEmailsSuccess;
  constructor(public payload: IListResult<IEmail>) {}
}

export class LoadEmailsFail implements Action {
  readonly type = CoreActionTypes.LoadEmailsFail;
  constructor(public payload: any) {}
}

export type CoreActions = LoadEmails | LoadEmailsSuccess | LoadEmailsFail;
