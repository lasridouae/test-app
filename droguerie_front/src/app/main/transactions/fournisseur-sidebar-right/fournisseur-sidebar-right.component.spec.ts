import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurSidebarRightComponent } from './fournisseur-sidebar-right.component';

describe('FournisseurSidebarRightComponent', () => {
  let component: FournisseurSidebarRightComponent;
  let fixture: ComponentFixture<FournisseurSidebarRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FournisseurSidebarRightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FournisseurSidebarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
