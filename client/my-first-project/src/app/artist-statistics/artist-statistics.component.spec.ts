import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistStatisticsComponent } from './artist-statistics.component';

describe('ArtistStatisticsComponent', () => {
  let component: ArtistStatisticsComponent;
  let fixture: ComponentFixture<ArtistStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
