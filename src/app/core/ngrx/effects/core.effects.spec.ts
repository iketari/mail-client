import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CoreEffects } from './core.effects';
import { reducers } from '../reducers';
import { EmailService } from '../../services/email.service';
import { StoreModule } from '@ngrx/store';

describe('CoreService', () => {
  let actions$: Observable<any>;
  let effects: CoreEffects;
  let emailServiceMock;

  beforeEach(() => {
    emailServiceMock = {
      getEmails: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), StoreModule.forFeature('core', reducers)],
      providers: [
        CoreEffects,
        provideMockActions(() => actions$),
        { provide: EmailService, useValue: emailServiceMock }
      ]
    });

    effects = TestBed.get(CoreEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
