import { Action } from '@ngrx/store';
import { IEmail } from '../../../shared/models/message';
import { IListResult } from '../../../shared/models/listresult';
import { IParticipant } from '../../../shared/models/search';

export enum ContextActionTypes {
  LoadParticipants = '[Context] Load Participants',
  LoadParticipantsSuccess = '[Context] Load Participants Success',
  LoadParticipantsFail = '[Context] Load Participants Fail'
}

export class LoadParticipants implements Action {
  readonly type = ContextActionTypes.LoadParticipants;
}

export class LoadParticipantsSuccess implements Action {
  readonly type = ContextActionTypes.LoadParticipantsSuccess;
  constructor(public payload: IParticipant[]) {}
}

export class LoadParticipantsFail implements Action {
  readonly type = ContextActionTypes.LoadParticipantsFail;
  constructor(public payload: any) {}
}

export type ContextActions = LoadParticipants | LoadParticipantsSuccess | LoadParticipantsFail;
