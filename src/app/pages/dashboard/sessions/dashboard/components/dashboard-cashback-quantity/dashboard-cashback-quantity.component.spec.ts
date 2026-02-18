import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCashbackQuantity } from './dashboard-cashback-quantity.component';

describe('DashboardCashbackQuantity', () => {
  let component: DashboardCashbackQuantity;
  let fixture: ComponentFixture<DashboardCashbackQuantity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCashbackQuantity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCashbackQuantity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
