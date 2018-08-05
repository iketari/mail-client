import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { reducers } from './ngrx/reducers';
import { EffectsModule } from '@ngrx/effects';
import { CoreEffects } from './ngrx/effects/core.effects';
import { SharedModule } from '../shared/shared.module';
import { EmailService } from './services/email.service';
import { BackendService } from './services/backend.service';
import { SidebarComponent } from './containers/sidebar/sidebar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '../../../node_modules/@angular/forms';

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

    SharedModule
  ],
  providers: [EmailService, BackendService]
})
export class CoreModule {}
