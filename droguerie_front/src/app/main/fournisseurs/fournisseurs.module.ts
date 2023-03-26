import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FournisseursComponent } from './fournisseurs.component';
import { FournisseurSidebarRightComponent } from './fournisseur-sidebar-right/fournisseur-sidebar-right.component';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'app/app.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'list',
    component: FournisseursComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [
    FournisseursComponent,
    FournisseurSidebarRightComponent
  ],
  bootstrap: [AppComponent],
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
  ],
  exports: [FournisseursComponent,FournisseurSidebarRightComponent]

})
export class FournisseursModule { }
