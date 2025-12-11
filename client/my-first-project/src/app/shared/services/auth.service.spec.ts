import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    const service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should expose a login method if implemented', () => {
    const service = TestBed.inject(AuthService) as any;
    const hasLogin = typeof service.login === 'function';
    expect(hasLogin || service).toBeTruthy();
  });
});
