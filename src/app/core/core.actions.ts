import { Action } from '@ngrx/store';

export enum CoreActionTypes {
  LoadCores = '[Core] Load Cores'
}

export class Core implements Action {
  readonly type = CoreActionTypes.LoadCores;
}

export type CoreActions = LoadCores;
