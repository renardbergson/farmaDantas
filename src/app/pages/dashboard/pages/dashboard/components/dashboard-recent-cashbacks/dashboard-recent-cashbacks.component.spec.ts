import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecentCashbacks } from './dashboard-recent-cashbacks.component';

describe('DashboardRecentCashbacks', () => {
  let component: DashboardRecentCashbacks;
  let fixture: ComponentFixture<DashboardRecentCashbacks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecentCashbacks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRecentCashbacks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
