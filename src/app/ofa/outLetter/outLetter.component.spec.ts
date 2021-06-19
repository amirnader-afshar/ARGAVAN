import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { outLettercomponent } from './outLettercomponent';

describe('outLetterComponent', () => {
  let component: outLettercomponent;
  let fixture: ComponentFixture<outLettercomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ outLettercomponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(outLettercomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
