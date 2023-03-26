import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule } from '@angular/forms';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CategorySidebarRightComponent } from '../categories/category-sidebar-right/category-sidebar-right.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';
import { NgSelectModule } from '@ng-select/ng-select';

const appRoutes: Routes = [
  {
    path: 'list',
    component: ProductsComponent,
    data: { animation: 'home' }
  },
  {
    path: 'edit/:id',
    component: EditProductComponent,
    data: { animation: 'home' }
  },
  {
    path: 'add',
    component: AddProductComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    // CategorySidebarRightComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ContentHeaderModule,
    FormsModule,
    LoadingCardComponent,
    NgxDatatableModule,
    NoDataFoundComponent,
    // CategorySidebarRightComponent,
    //NgBootstrap
    NgbModule,
    CoreCommonModule,  // important
    // CoreSidebarModule,
    CoreThemeCustomizerModule,
    NgSelectModule
  ],
  exports: [
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    // CategorySidebarRightComponent

  ]
})
export class ProductsModule { }
