import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { reducers } from './ngrx/reducers';
import { EffectsModule } from '@ngrx/effects';
import { CoreEffects } from './ngrx/effects/core.effects';
import { SharedModule } from '../shared/shared.module';
import { EmailService } from './services/email.service';
import { SidebarComponent } from './containers/sidebar/sidebar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
  imports: [
    BrowserModule,
    StoreModule.forFeature('core', reducers),
    EffectsModule.forFeature([CoreEffects]),
    RouterModule,

    FormsModule,
    NgSelectModule,

    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    SharedModule
  ],
  providers: [EmailService]
})
export class CoreModule {}
