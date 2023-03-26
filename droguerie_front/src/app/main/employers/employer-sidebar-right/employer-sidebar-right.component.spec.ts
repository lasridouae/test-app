import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSidebarRightComponent } from './employer-sidebar-right.component';

describe('EmployerSidebarRightComponent', () => {
  let component: EmployerSidebarRightComponent;
  let fixture: ComponentFixture<EmployerSidebarRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerSidebarRightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerSidebarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
