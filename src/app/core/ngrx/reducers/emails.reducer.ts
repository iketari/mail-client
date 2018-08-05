import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CoreActions, CoreActionTypes } from '../actions/core.actions';
import { IEmail } from '../../../shared/models/message';

export interface State {
  loading: boolean;
  selected: IEmail;
}

export const initialState: State = {
  loading: false,
  selected: null
};

export function reducer(state = initialState, action: CoreActions): State {
  switch (action.type) {
    case CoreActionTypes.LoadEmail:
      return {
        ...state,
        loading: true
      };

    case CoreActionTypes.LoadEmailSuccess:
      const email = action.payload;
      return {
        loading: false,
        selected: email
      };

    case CoreActionTypes.LoadEmailFail:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selected;
