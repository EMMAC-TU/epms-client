// This file has been automatically generated for unit testing via the Karma test runner
import { TestBed } from '@angular/core/testing';

import { AdminService } from '../services/admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
