import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SuperManagerPanelComponent} from './super-manager-panel.component';
import {UsersTabComponent} from './users-tab/users-tab.component';
import {SuperManagerPanelRoutes} from './super-manager-panel.routing';
import {DashboardTabComponent} from './dashboard-tab/dashboard-tab.component';
import {ProjectsTabComponent} from './projects-tab/projects-tab.component';
import {RlTagInputModule} from 'angular2-tag-input/dist';
import {ManagerTabComponent} from './manager-tab/manager-tab.component';
import {NotificationTabComponent} from './notification-tab/notification-tab.component';
import {MultiPlayerTabComponent} from './multi-player-tab/multi-player-tab.component';

@NgModule({
  declarations: [
    SuperManagerPanelComponent,
    UsersTabComponent,
    DashboardTabComponent,
    ProjectsTabComponent,
    ManagerTabComponent,
    NotificationTabComponent,
    MultiPlayerTabComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RlTagInputModule,
    RouterModule.forChild(SuperManagerPanelRoutes),
  ],
  providers: []
})
export class SuperManagerPanelModule {
}
