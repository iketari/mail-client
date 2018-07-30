import { Action } from '@ngrx/store';
import { CoreActions, CoreActionTypes } from './core.actions';

export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: CoreActions): State {
  switch (action.type) {

    case CoreActionTypes.LoadCores:
      return state;


    default:
      return state;
  }
}
