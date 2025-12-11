import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MusicUploadComponent } from './music-upload.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MusicUploadComponent', () => {
  let component: MusicUploadComponent;
  let fixture: ComponentFixture<MusicUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicUploadComponent, HttpClientTestingModule, NoopAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusicUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose an upload method or equivalent', () => {
    const hasUpload = typeof (component as any).upload === 'function';
    const hasOnSubmit = typeof (component as any).onSubmit === 'function';
    expect(hasUpload || hasOnSubmit).toBeTrue();
  });
});
