import { TestBed } from '@angular/core/testing';
import { StringUtilsService } from './string-utils.service';

describe('StringUtilsService', () => {
  let service: StringUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when base and one of the others are null', () => {
    expect(service.equalsAnyIgnoreCase(null, null, null)).toBeTrue();
  });

  it('should return false when base is null and others are not', () => {
    expect(service.equalsAnyIgnoreCase(null, 'abc', 'def')).toBeFalse();
  });

  it('should return false when base is not null but others are', () => {
    expect(service.equalsAnyIgnoreCase('abc', null, 'def')).toBeFalse();
  });

  it('should return true for case-insensitive match', () => {
    expect(service.equalsAnyIgnoreCase('abc', 'abc', 'def')).toBeTrue();
    expect(service.equalsAnyIgnoreCase('abc', 'ABC', 'DEF')).toBeTrue();
  });

  it('should return false when no match is found', () => {
    expect(service.equalsAnyIgnoreCase('abc', 'xyz', 'def')).toBeFalse();
  });
});
