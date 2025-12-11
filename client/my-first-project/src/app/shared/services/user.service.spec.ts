import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({      
      imports: [
        HttpClientTestingModule
      ]});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    const service = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });

  it('should have optional baseUrl if defined', () => {
    const service = TestBed.inject(UserService) as any;
    if (service.baseUrl !== undefined) {
      expect(typeof service.baseUrl).toBe('string');
    } else {
      expect(service).toBeTruthy();
    }
  });
});
