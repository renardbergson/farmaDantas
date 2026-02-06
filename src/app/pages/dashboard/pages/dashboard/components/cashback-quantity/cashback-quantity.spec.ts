import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackQuantity } from './cashback-quantity';

describe('CashbackQuantity', () => {
  let component: CashbackQuantity;
  let fixture: ComponentFixture<CashbackQuantity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashbackQuantity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashbackQuantity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
