import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockApp = {
    setRole: jasmine.createSpy('setRole'),
    setNickname: jasmine.createSpy('setNickname')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule],
      providers: [{ provide: AppComponent, useValue: mockApp }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an initial login form state when present', () => {
    if ((component as any).loginForm) {
      expect((component as any).loginForm.valid).toBeFalse();
    } else {
      expect(component).toBeTruthy();
    }
  });
});
