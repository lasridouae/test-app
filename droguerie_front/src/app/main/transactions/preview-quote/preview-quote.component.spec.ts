import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewQuoteComponent } from './preview-quote.component';

describe('PreviewQuoteComponent', () => {
  let component: PreviewQuoteComponent;
  let fixture: ComponentFixture<PreviewQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewQuoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
