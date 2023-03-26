import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRegisterV2Component } from './auth-register-v2.component';

describe('AuthRegisterV2Component', () => {
  let component: AuthRegisterV2Component;
  let fixture: ComponentFixture<AuthRegisterV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthRegisterV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthRegisterV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
