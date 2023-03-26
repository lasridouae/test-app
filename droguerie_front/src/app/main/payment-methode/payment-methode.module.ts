import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule, Routes } from '@angular/router';
import { TraiteComponent } from './traite/traite.component';
import { CreditComponent } from './credit/credit.component';
import { ChequeComponent } from './cheque/cheque.component';
import { CashComponent } from './cash/cash.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterComponent } from './filter.component';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { FormsModule } from '@angular/forms';
import { CoreThemeCustomizerModule } from '@core/components/theme-customizer/theme-customizer.module';


const routes: Routes = [

  {
    path: 'traites/list/:in_out',
    component: TraiteComponent,

  },
  {
    path: 'credits/list/:in_out',
    component: CreditComponent,

  },
  {
    path: 'cahes/list/:in_out',
    component: CashComponent,

  },
  {
    path: 'cheques/list/:in_out',
    component: ChequeComponent,

  },


  // {
  //   path: '',
  //   redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  // },
];
@NgModule({
  declarations: [
    TraiteComponent,
    CreditComponent,
    CashComponent,
    ChequeComponent,
    FilterComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    NgSelectModule,
    LoadingCardComponent,
    // CsvModule
    CommonModule,

    FormsModule,

        CoreThemeCustomizerModule,
  ]
})
export class PaymentMethodeModule { }
