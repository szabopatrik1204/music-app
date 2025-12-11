import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ArtistStatisticsComponent } from './artist-statistics.component';
import { COMMON_TEST_IMPORTS, COMMON_TEST_PROVIDERS } from '../../test-helpers/test-setup';

describe('ArtistStatisticsComponent', () => {
  let component: ArtistStatisticsComponent;
  let fixture: ComponentFixture<ArtistStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // standalone component must be imported, not declared
      imports: [ArtistStatisticsComponent, ...COMMON_TEST_IMPORTS],
      providers: [...COMMON_TEST_PROVIDERS],
      schemas: [NO_ERRORS_SCHEMA]
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
