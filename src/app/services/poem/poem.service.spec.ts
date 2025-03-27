import { TestBed } from '@angular/core/testing';

import { PoemService } from './poem.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('PoemService', () => {
  let service: PoemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PoemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
