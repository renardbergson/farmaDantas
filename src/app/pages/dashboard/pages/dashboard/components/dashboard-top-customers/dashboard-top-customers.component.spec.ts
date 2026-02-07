import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopCustomers } from './dashboard-top-customers.component';

describe('DashboardTopCustomers', () => {
  let component: DashboardTopCustomers;
  let fixture: ComponentFixture<DashboardTopCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTopCustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTopCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
