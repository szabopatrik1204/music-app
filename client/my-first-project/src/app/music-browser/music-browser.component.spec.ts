import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MusicBrowserComponent } from './music-browser.component';

describe('MusicBrowserComponent', () => {
  let component: MusicBrowserComponent;
  let fixture: ComponentFixture<MusicBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicBrowserComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusicBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
