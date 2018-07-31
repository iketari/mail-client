import { createSelector, createFeatureSelector, ActionReducer, ActionReducerMap } from '@ngrx/store';

import * as fromCore from './core.reducer';
import * as fromRoot from '../,./../../../reducers';

export interface CoreState {
    
}

export interface State extends fromRoot.State {
    core: CoreState;
}

export const reducers: ActionReducerMap<CoreState> = {

}