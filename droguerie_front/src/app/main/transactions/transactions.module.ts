import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListQuotesComponent } from './list-quotes/list-quotes.component';
import { AddQuoteComponent } from './add-quote/add-quote.component';
import { AppComponent } from 'app/app.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule } from '@angular/forms';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { NgSelectModule } from '@ng-select/ng-select';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CoreDirectivesModule } from '@core/directives/directives';
import { ClientSidebarRightComponent } from './client-sidebar-right/client-sidebar-right.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreviewQuoteComponent } from './preview-quote/preview-quote.component';
import { EditQuoteComponent } from './edit-quote/edit-quote.component';
import { FournisseurSidebarRightComponent } from './fournisseur-sidebar-right/fournisseur-sidebar-right.component';
import { GenerateInvoiceSaleComponent } from './generate-invoice-sale/generate-invoice-sale.component';

const appRoutes: Routes = [
  // {
  //   path: 'quotes/list',
  //   component: ListQuotesComponent,
  //   data: { animation: 'ListQuotesComponent' }
  // },
  {
    path: ':type/list',  // cheques/list/:in_out
    component: ListQuotesComponent,
    data: { animation: 'ListQuotesComponent' }
  },
  {
    path: ':type/add',
    component: AddQuoteComponent,
    data: { animation: 'AddQuoteComponent' }
  },
  {
    path: ':type/preview/:id',
    component: PreviewQuoteComponent,
    data: { animation: 'PreviewQuoteComponent' }
  },
  {
    path: ':type/edit/:id',
    component: EditQuoteComponent,
    data: { animation: 'EditQuoteComponent' }
  },
  {
    path: ':type/list/:in_out',
    component: ListQuotesComponent,
    data: { animation: 'ListQuotesComponent' }
  },
  {
    path: ':type/edit/:in_out/:id',
    component: EditQuoteComponent,
    data: { animation: 'EditQuoteComponent' }
  },
  {
    path: 'generate/:type/:in_out/:id', // Generate Invoice
    component: GenerateInvoiceSaleComponent,
    data: { animation: 'GenerateInvoiceSaleComponent' }
  },
  {
    path: 'generate/:type/:id',
    component: GenerateInvoiceSaleComponent, // Generate Sale
    data: { animation: 'GenerateInvoiceSaleComponent' }
  },
  {
    path: 'invoice/add',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
    ListQuotesComponent,
    AddQuoteComponent,
    ClientSidebarRightComponent,
    FournisseurSidebarRightComponent,
    PreviewQuoteComponent,
    EditQuoteComponent,
    GenerateInvoiceSaleComponent,
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
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    NgSelectModule,
    CorePipesModule,
    Ng2FlatpickrModule,
    CoreDirectivesModule
  ],
  exports: [
    ListQuotesComponent,
    AddQuoteComponent,
    ClientSidebarRightComponent,
    FournisseurSidebarRightComponent,
  ]
})
export class TransactionsModule { }
