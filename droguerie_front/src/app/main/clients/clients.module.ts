import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CsvModule } from '@ctrl/ngx-csv';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ClientSidebarRightComponent } from './client-sidebar-right/client-sidebar-right.component';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { AppComponent } from 'app/app.component';


const appRoutes: Routes = [
  {
    path: 'list',
    component: ClientsComponent,
    data: { animation: 'home' }
  }
];


@NgModule({
  declarations: [
    ClientSidebarRightComponent,ClientsComponent
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
    LoadingCardComponent,

    //NgBootstrap
    NgbModule,
    CoreCommonModule,  // important
    CoreSidebarModule,
    CoreThemeCustomizerModule,
  ],
  exports: [ClientSidebarRightComponent,ClientsComponent]
})
export class ClientsModule { }
