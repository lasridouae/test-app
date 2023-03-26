import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSidebarRightComponent } from './service-sidebar-right.component';

describe('ServiceSidebarRightComponent', () => {
  let component: ServiceSidebarRightComponent;
  let fixture: ComponentFixture<ServiceSidebarRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSidebarRightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSidebarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
