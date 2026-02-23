import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAddNewModal } from './purchase-add-new-modal';

describe('PurchaseAddNewModal', () => {
  let component: PurchaseAddNewModal;
  let fixture: ComponentFixture<PurchaseAddNewModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseAddNewModal]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseAddNewModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
