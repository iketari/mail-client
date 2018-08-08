import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ContextActionTypes, ContextActions } from '../actions/context.actions';
import { IEmail } from '../../../shared/models/message';
import { IParticipant, ISearchQuery } from '../../../shared/models/search';
import { SearchActions, SearchActionTypes } from '../actions/search.actions';

export interface State extends EntityState<IParticipant> {
  loading: boolean;
}

export const adapter: EntityAdapter<IParticipant> = createEntityAdapter<IParticipant>({
  selectId: (item: IParticipant) => item.id
});

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(state = initialState, action: ContextActions | SearchActions): State {
  switch (action.type) {
    case ContextActionTypes.LoadParticipants:
      return {
        ...state,
        loading: true
      };

    case ContextActionTypes.LoadParticipantsSuccess:
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };

    case ContextActionTypes.LoadParticipantsFail:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selected;
