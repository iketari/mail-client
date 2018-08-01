import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CoreActions, CoreActionTypes } from '../actions/core.actions';
import { IEmail } from '../../../shared/models/email';

export interface State extends EntityState<IEmail> {
  loading: boolean;
  total: number;
  page: number;
  limit: number;
}

export const adapter: EntityAdapter<IEmail> = createEntityAdapter<IEmail>({
  selectId: (email: IEmail) => email.from + email.to.join('|') + email.subject
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  total: 0,
  page: 0,
  limit: 10
});

export function reducer(state = initialState, action: CoreActions): State {
  switch (action.type) {

    case CoreActionTypes.LoadEmails:
      return {
        ...state,
        loading: true,
        page: action.payload.page
      };

    case CoreActionTypes.LoadEmailsSuccess:
      return {
        ...adapter.addAll(action.payload.items, state),
        loading: false,
        total: action.payload.total
      };

    case CoreActionTypes.LoadEmailsFail:
      return {
        ...initialState,
        limit: state.limit
      };

    default:
      return state;
  }
}
