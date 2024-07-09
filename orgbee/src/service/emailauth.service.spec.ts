import { TestBed } from '@angular/core/testing';

import { EmailauthService } from './emailauth.service';

describe('EmailauthService', () => {
  let service: EmailauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
