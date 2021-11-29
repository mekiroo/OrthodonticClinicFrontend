import { TestBed } from '@angular/core/testing';

import { VisitTypeService } from './visit-type.service';

describe('VisitTypeService', () => {
  let service: VisitTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
