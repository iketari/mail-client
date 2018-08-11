import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LetterAvatarComponent } from './letter-avatar.component';

const pretty = require('pretty');

describe('LetterAvatarComponent', () => {
  let comp: LetterAvatarComponent;
  let fixture: ComponentFixture<LetterAvatarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LetterAvatarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LetterAvatarComponent);
    comp = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should match snapshop', () => {
    comp.name = 'iketari@gmail.com';

    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(pretty(fixture.nativeElement.outerHTML)).toMatchSnapshot();
  });

  it('should match snapshop', () => {
    comp.name = 'Artsiom Mezin';

    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(pretty(fixture.nativeElement.outerHTML)).toMatchSnapshot();
  });
});
