import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashbacks } from './cashbacks';

describe('Cashbacks', () => {
  let component: Cashbacks;
  let fixture: ComponentFixture<Cashbacks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cashbacks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cashbacks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
