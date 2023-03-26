import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { ServiceSidebarRightComponent } from './service-sidebar-right/service-sidebar-right.component';

const appRoutes: Routes = [
  {
    path: 'list',
    component: ServicesComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [
    ServicesComponent,
    ServiceSidebarRightComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ContentHeaderModule,
    NgxDatatableModule,
    FormsModule,
    LoadingCardComponent,

        //NgBootstrap
        NgbModule,
        CoreCommonModule,  // important
        CoreSidebarModule,
        CoreThemeCustomizerModule,
  ]
})
export class ServicesModule { }
