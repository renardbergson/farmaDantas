import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCashbackMeasure } from './dashboard-cashback-measure.component';

describe('DashboardCashbackMeasure', () => {
  let component: DashboardCashbackMeasure;
  let fixture: ComponentFixture<DashboardCashbackMeasure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCashbackMeasure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCashbackMeasure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
