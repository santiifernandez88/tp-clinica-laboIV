import { TestBed } from '@angular/core/testing';

import { LogUsuariosService } from './log-usuarios.service';

describe('LogUsuariosService', () => {
  let service: LogUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
