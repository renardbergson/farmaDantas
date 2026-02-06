import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCashbacks } from './recent-cashbacks';

describe('RecentCashbacks', () => {
  let component: RecentCashbacks;
  let fixture: ComponentFixture<RecentCashbacks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentCashbacks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentCashbacks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
