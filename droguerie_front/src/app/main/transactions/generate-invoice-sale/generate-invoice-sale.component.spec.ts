import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInvoiceSaleComponent } from './generate-invoice-sale.component';

describe('GenerateInvoiceSaleComponent', () => {
  let component: GenerateInvoiceSaleComponent;
  let fixture: ComponentFixture<GenerateInvoiceSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateInvoiceSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateInvoiceSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
