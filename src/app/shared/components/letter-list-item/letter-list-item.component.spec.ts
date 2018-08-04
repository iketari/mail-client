import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterListItemComponent } from './letter-list-item.component';

describe('LetterListItemComponent', () => {
  let component: LetterListItemComponent;
  let fixture: ComponentFixture<LetterListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LetterListItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
