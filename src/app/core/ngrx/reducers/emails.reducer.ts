import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CoreActions, CoreActionTypes } from '../actions/core.actions';
import { IEmail } from '../../../shared/models/email';

export interface State extends EntityState<IEmail> {
  loading: boolean;
}

export const adapter: EntityAdapter<IEmail> = createEntityAdapter<IEmail>({
  selectId: (email: IEmail) => email.from + email.to.join('|') + email.subject
});

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(state = initialState, action: CoreActions): State {
  switch (action.type) {

    case CoreActionTypes.LoadEmailsSuccess:
      return adapter.addAll(action.payload, state)


    default:
      return state;
  }
}
