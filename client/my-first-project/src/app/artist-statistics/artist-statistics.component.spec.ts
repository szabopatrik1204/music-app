import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArtistStatisticsComponent } from './artist-statistics.component';

describe('ArtistStatisticsComponent', () => {
  let component: ArtistStatisticsComponent;
  let fixture: ComponentFixture<ArtistStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [ArtistStatisticsComponent, HttpClientTestingModule],
    
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistStatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "Nincs statisztika." when data empty', () => {
    component.data = [];
    fixture.detectChanges();
    const el: HTMLElement | null = fixture.nativeElement.querySelector('.no-statistics');
    expect(el).toBeTruthy();
    expect(el?.textContent?.trim()).toBe('Nincs statisztika.');
  });
});
