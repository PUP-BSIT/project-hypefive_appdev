import { TestBed } from '@angular/core/testing';

import { ForgotPassService } from './forgotpass.service';

describe('ForgotpassService', () => {
  let service: ForgotPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgotPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
