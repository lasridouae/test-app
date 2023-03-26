import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { DashboardModule } from 'app/main/dashboard/dashboard.module';
import { ClientsModule } from 'app/main/clients/clients.module';
import { CategoriesModule } from 'app/main/categories/categories.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http'
import {  AuthGuard, ErrorInterceptor, fakeBackendProvider, JwtInterceptor } from 'app/auth/helpers';
// import { ClientsComponent } from './main/clients/clients.component';
import { ContentHeaderModule } from "./layout/components/content-header/content-header.module";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CategoriesComponent } from './main/categories/categories.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';
import { Role } from './auth/models';
import { PublicGuard } from './auth/helpers/public.guards';
// import { NoDataFoundComponent } from './main/no-data-found/no-data-found.component';

const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
    canActivate: [PublicGuard]

  },
  {
    path: 'settings',
    loadChildren: () => import('./main/settings/settings.module').then(m => m.SettingsModule),
    data: { animation: 'sample', roles: [Role.Admin] },
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./main/products/products.module').then(m => m.ProductsModule),
    data: { animation: 'sample', roles: [Role.Admin, Role.Manager] },
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadChildren: () => import('./main/clients/clients.module').then(m => m.ClientsModule),
    data: { animation: 'sample', roles: [Role.Admin] },
    canActivate: [AuthGuard]
  },
  {
    path: 'fournisseurs',
    loadChildren: () => import('./main/fournisseurs/fournisseurs.module').then(m => m.FournisseursModule),
    data: { animation: 'sample', roles: [Role.Admin] },
    canActivate: [AuthGuard]
  },
  {
    path: 'services',
    loadChildren: () => import('./main/services/services.module').then(m => m.ServicesModule),
    data: { animation: 'sample', roles: [Role.Admin, Role.Manager] },
    canActivate: [AuthGuard]
  },
  {
    path: 'employers',
    loadChildren: () => import('./main/employers/employers.module').then(m => m.EmployersModule),
    data: { animation: 'sample', roles: [Role.Admin] },
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./main/users/users.module').then(m => m.UsersModule),
    data: { animation: 'sample', roles: [Role.Admin] },
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./main/categories/categories.module').then(m => m.CategoriesModule),
    data: { animation: 'sample', roles: [Role.Admin, Role.Manager] },
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./main/edit-profile/edit-profile.module').then(m => m.EditProfileModule),
    data: { animation: 'sample', roles: [Role.Admin, Role.Manager] },
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    loadChildren: () => import('./main/transactions/transactions.module').then(m => m.TransactionsModule),
    data: { animation: 'sample', roles: [Role.Admin, Role.Manager] },
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./main/payment-methode/payment-methode.module').then(m => m.PaymentMethodeModule),
    data: { animation: 'sample', roles: [Role.Admin] },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
    data: { animation: 'sample', roles: [Role.Admin, Role.Manager] },
    // canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
    declarations: [AppComponent, /*NoDataFoundComponent, ClientsComponent, CategoriesComponent*/],
    bootstrap: [AppComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        fakeBackendProvider
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled',
            relativeLinkResolution: 'legacy'
        }),
        TranslateModule.forRoot(),
        HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
          delay: 0,
          passThruUnknownUrl: true
      }),
        //NgBootstrap
        NgbModule,
        ToastrModule.forRoot(),
        // Core modules
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,
        // App modules
        LayoutModule,
        DashboardModule,
        // ClientsModule,
        // CategoriesModule,
        ContentHeaderModule,
        NgxDatatableModule,
        // LoadingCardComponent
    ],
    // exports: [LoadingCardComponent]

})
export class AppModule {}
