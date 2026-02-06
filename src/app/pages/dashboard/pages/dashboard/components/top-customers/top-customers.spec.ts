import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCustomers } from './top-customers';

describe('TopCustomers', () => {
  let component: TopCustomers;
  let fixture: ComponentFixture<TopCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
