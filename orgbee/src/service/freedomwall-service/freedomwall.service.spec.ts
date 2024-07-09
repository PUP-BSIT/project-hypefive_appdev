import { TestBed } from '@angular/core/testing';

import { FreedomwallService } from './freedomwall.service';

describe('FreedomwallService', () => {
  let service: FreedomwallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreedomwallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
