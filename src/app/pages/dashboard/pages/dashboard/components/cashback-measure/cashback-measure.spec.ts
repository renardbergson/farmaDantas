import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackMeasure } from './cashback-measure';

describe('CashbackMeasure', () => {
  let component: CashbackMeasure;
  let fixture: ComponentFixture<CashbackMeasure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashbackMeasure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashbackMeasure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
