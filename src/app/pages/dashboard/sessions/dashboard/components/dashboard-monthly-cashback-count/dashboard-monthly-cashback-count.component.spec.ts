import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMonthlyCashbackCount } from './dashboard-monthly-cashback-count.component';

describe('DashboardMonthlyCashbackCount', () => {
  let component: DashboardMonthlyCashbackCount;
  let fixture: ComponentFixture<DashboardMonthlyCashbackCount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMonthlyCashbackCount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMonthlyCashbackCount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
