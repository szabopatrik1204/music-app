import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MusicManagementComponent } from './music-management.component';

describe('MusicManagementComponent', () => {
  let component: MusicManagementComponent;
  let fixture: ComponentFixture<MusicManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicManagementComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
