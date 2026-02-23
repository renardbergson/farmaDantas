import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSearchbar } from './purchase-searchbar';

describe('PurchaseSearchbar', () => {
  let component: PurchaseSearchbar;
  let fixture: ComponentFixture<PurchaseSearchbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseSearchbar]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseSearchbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
