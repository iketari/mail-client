import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { reducers } from './ngrx/reducers';
import { EffectsModule } from '@ngrx/effects';
import { CoreEffects } from './ngrx/effects/core.effects';
import { SharedModule } from '../shared/shared.module';
import { EmailService } from './services/email.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    StoreModule.forFeature('core', reducers),
    EffectsModule.forFeature([CoreEffects]),
    RouterModule,

    SharedModule
  ],
  providers: [EmailService]
})
export class CoreModule {}
