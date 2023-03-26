import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployersComponent } from './employers.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { EmployerSidebarRightComponent } from './employer-sidebar-right/employer-sidebar-right.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

const appRoutes: Routes = [
  {
    path: 'list',
    component: EmployersComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [
    EmployersComponent,
    EmployerSidebarRightComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ContentHeaderModule,
    NgxDatatableModule,
    FormsModule,
    LoadingCardComponent,
    Ng2FlatpickrModule,
    ReactiveFormsModule,
        //NgBootstrap
        NgbModule,
        CoreCommonModule,  // important
        CoreSidebarModule,
        CoreThemeCustomizerModule,
  ]
})
export class EmployersModule { }
