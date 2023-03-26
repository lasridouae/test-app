import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreThemeCustomizerModule } from '@core/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'app/app.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';

import { SettingsComponent } from './settings.component';


const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: { animation: 'SettingsComponent' }
  }
];
@NgModule({
  declarations: [
    SettingsComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    FormsModule,
    LoadingCardComponent,
    NoDataFoundComponent,//NgBootstrap
    NgbModule,
    CoreCommonModule,  // important
    CoreThemeCustomizerModule,
  ],
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule { }
