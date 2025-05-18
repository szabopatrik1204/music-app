import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicManagementComponent } from './music-management.component';

describe('MusicManagementComponent', () => {
  let component: MusicManagementComponent;
  let fixture: ComponentFixture<MusicManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicManagementComponent]
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
