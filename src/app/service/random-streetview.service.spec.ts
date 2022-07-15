import { TestBed } from '@angular/core/testing';

import { RandomStreetviewService } from './random-streetview.service';

describe('RandomStreetviewService', () => {
  let service: RandomStreetviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomStreetviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
