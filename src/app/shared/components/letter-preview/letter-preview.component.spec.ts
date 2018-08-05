import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterPreviewComponent } from './letter-preview.component';

describe('LetterPreviewComponent', () => {
  let component: LetterPreviewComponent;
  let fixture: ComponentFixture<LetterPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LetterPreviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
