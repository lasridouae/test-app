import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSidebarRightComponent } from './client-sidebar-right.component';

describe('ClientSidebarRightComponent', () => {
  let component: ClientSidebarRightComponent;
  let fixture: ComponentFixture<ClientSidebarRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSidebarRightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSidebarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
