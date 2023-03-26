import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';


import { DashboardComponent } from './dashboard.component';

import { AuthGuard } from 'app/auth/helpers';
import { CardStatistiqueComponent } from './card-statistique/card-statistique.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { ChartsModule } from 'ng2-charts';
import { DataTableComponent } from './data-table/data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
// import { Role } from 'app/auth/models'

const routes = [
  // {
  //   path: 'sample',
  //   component: SampleComponent,
  //   data: { animation: 'sample', roles: [Role.Admin, Role.Manager] },
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { animation: 'home' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [ DashboardComponent, CardStatistiqueComponent, BarChartComponent, PieChartComponent, DataTableComponent],
  imports: [
    RouterModule.forChild(routes),FormsModule, ReactiveFormsModule,
    LoadingCardComponent,NgxDatatableModule, ContentHeaderModule,
     TranslateModule, CoreCommonModule,NgApexchartsModule,Ng2FlatpickrModule,ChartsModule,NgbModule,NgSelectModule],
  exports: [ DashboardComponent]
})
export class DashboardModule {}
