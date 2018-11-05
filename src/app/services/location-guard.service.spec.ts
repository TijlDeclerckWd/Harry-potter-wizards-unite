import { TestBed, inject } from '@angular/core/testing';

import { LocationGuardService } from './location-guard.service';

describe('LocationGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationGuardService]
    });
  });

  it('should be created', inject([LocationGuardService], (service: LocationGuardService) => {
    expect(service).toBeTruthy();
  }));
});
