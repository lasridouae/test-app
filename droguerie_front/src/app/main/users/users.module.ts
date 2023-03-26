import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule } from '@angular/forms';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';
import { UsersComponent } from './users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddUserComponent } from './add-user/add-user.component';


const appRoutes: Routes = [
  {
    path: 'list',
    component: UsersComponent,
    data: { animation: 'home' }
  },
  {
    path: 'edit/:id',
    component: EditUserComponent,
    data: { animation: 'home' }
  },
  {
    path: 'add',
    component: AddUserComponent,
    data: { animation: 'home' }
  }
];


@NgModule({
  declarations: [
    UsersComponent,
    AddUserComponent,
    EditUserComponent
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
    // CoreSidebarModule,
    CoreThemeCustomizerModule,
  ],
  exports: [
    UsersComponent,
    AddUserComponent,
    EditUserComponent
  ]
})
export class UsersModule { }
