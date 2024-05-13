import { TestBed } from '@angular/core/testing';

import { ViewPasswordService } from './view-password.service';

describe('ViewPasswordService', () => {
  let service: ViewPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
