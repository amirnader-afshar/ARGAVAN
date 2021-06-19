import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { AppComponent } from "../../app.component";

test('renders markup to snapshot', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture).toBeTruthy()
  });