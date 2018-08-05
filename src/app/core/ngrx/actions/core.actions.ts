import { Action } from '@ngrx/store';
import { IEmail } from '../../../shared/models/message';
import { IListResult } from '../../../shared/models/listresult';

export enum CoreActionTypes {
  LoadEmail = '[Core] Load Email',
  LoadEmailSuccess = '[Core] Load Email Success',
  LoadEmailFail = '[Core] Load Email Fail'
}

export class LoadEmail implements Action {
  readonly type = CoreActionTypes.LoadEmail;
  constructor(public payload: { id: string }) {}
}

export class LoadEmailSuccess implements Action {
  readonly type = CoreActionTypes.LoadEmailSuccess;
  constructor(public payload: IEmail) {}
}

export class LoadEmailFail implements Action {
  readonly type = CoreActionTypes.LoadEmailFail;
  constructor(public payload: any) {}
}

export type CoreActions = LoadEmail | LoadEmailSuccess | LoadEmailFail;
