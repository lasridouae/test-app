import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySidebarRightComponent } from './category-sidebar-right.component';

describe('CategorySidebarRightComponent', () => {
  let component: CategorySidebarRightComponent;
  let fixture: ComponentFixture<CategorySidebarRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySidebarRightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySidebarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
