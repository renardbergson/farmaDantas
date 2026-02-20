import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMonthlyCashbackValues } from './dashboard-monthly-cashback-values.component';

describe('DashboardMonthlyCashbackValues', () => {
  let component: DashboardMonthlyCashbackValues;
  let fixture: ComponentFixture<DashboardMonthlyCashbackValues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMonthlyCashbackValues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMonthlyCashbackValues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
