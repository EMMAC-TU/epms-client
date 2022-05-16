// This file has been automatically generated for unit testing via the Karma test runner
import { TestBed } from '@angular/core/testing';

import { CreatePatientGuard } from './create-patient.guard';

describe('CreatePatientGuard', () => {
  let guard: CreatePatientGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreatePatientGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
