import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatsGrid } from './dashboard-stats-grid.component';

describe('DashboardStatsGrid', () => {
  let component: DashboardStatsGrid;
  let fixture: ComponentFixture<DashboardStatsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatsGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
