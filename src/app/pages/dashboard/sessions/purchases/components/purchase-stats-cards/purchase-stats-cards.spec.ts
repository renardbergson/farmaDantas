import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStatsCards } from './purchase-stats-cards';

describe('PurchaseStatsCards', () => {
  let component: PurchaseStatsCards;
  let fixture: ComponentFixture<PurchaseStatsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseStatsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseStatsCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
