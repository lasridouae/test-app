
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CsvModule } from '@ctrl/ngx-csv';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CategorySidebarRightComponent } from './category-sidebar-right/category-sidebar-right.component';
import { CategoriesComponent } from './categories.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { AppComponent } from 'app/app.component';
import { CoreCommonModule } from '@core/common.module';

const appRoutes: Routes = [
  {
    path: 'list',
    component: CategoriesComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [
    CategorySidebarRightComponent,
    CategoriesComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ContentHeaderModule,
    CsvModule,
    NgxDatatableModule,
    FormsModule,
    CoreSidebarModule,
    NgSelectModule,
    NgbProgressbarModule,
    CorePipesModule,
    LoadingCardComponent,

    //NgBootstrap
    NgbModule,
    CoreCommonModule,  // important
    CoreSidebarModule,
    CoreThemeCustomizerModule,
  ],
  exports: [CategorySidebarRightComponent,CategoriesComponent]

})
export class CategoriesModule { }
