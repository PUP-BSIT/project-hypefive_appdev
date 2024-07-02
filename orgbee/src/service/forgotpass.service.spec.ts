import { TestBed } from '@angular/core/testing';

import { ForgotpassService } from './forgotpass.service';

describe('ForgotpassService', () => {
  let service: ForgotpassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgotpassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
