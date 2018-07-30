import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CoreActions, CoreActionTypes } from './core.actions';

@Injectable()
export class CoreEffects {

  @Effect()
  effect$ = this.actions$.ofType(CoreActionTypes.LoadCores);

  constructor(private actions$: Actions) {}
}
