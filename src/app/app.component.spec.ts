import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { Store, StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      declarations: [AppComponent, PaginationComponent]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
