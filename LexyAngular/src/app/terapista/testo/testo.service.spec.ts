import { TestBed } from '@angular/core/testing';

import { TestoService } from './testo.service';

describe('TestoService', () => {
  let service: TestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
