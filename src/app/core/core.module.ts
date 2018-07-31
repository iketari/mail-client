import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { reducers } from './ngrx/reducers';
import { EffectsModule } from '../../../node_modules/@ngrx/effects';
import { CoreEffects } from './ngrx/effects/core.effects';

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        StoreModule.forFeature('core', reducers),
        EffectsModule.forFeature([CoreEffects]),
        RouterModule
    ],
    providers: []
})
export class CoreModule {}