import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SuperAdminPanelComponent} from './super-admin-panel.component';
import {UsersTabComponent} from './users-tab/users-tab.component';
import {CompaniesTabComponent} from './companies-tab/companies-tab.component';
import {SuperAdminPanelRoutes} from './super-admin-panel.routing';

@NgModule({
  declarations: [
    SuperAdminPanelComponent,
    UsersTabComponent,
    CompaniesTabComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(SuperAdminPanelRoutes),
  ],
  providers: []
})
export class SuperAdminPanelModule {
}
