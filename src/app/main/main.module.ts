import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {MainRoutes} from './main.routing';
import {SuperAdminPanelModule} from './panels/super-admin-panel/super-admin-panel.module';
import {DataTablesModule} from 'angular-datatables';
import {ManagerPanelModule} from './panels/manager-panel/manager-panel.module';
import {SuperManagerPanelModule} from './panels/super-manager-panel/super-manager-panel.module';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    SuperAdminPanelModule,
    SuperManagerPanelModule,
    ManagerPanelModule,
    DataTablesModule,
    RouterModule.forChild(MainRoutes),
  ],
  providers: []
})
export class MainModule {
}
