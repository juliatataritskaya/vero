import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ManagerPanelComponent} from './manager-panel.component';
import {ManagerPanelRoutes} from './manager-panel.routing';
import {ProjectsTabComponent} from './projects-tab/projects-tab.component';
import {UsersTabComponent} from './users-tab/users-tab.component';
import {RlTagInputModule} from 'angular2-tag-input';
import {DashboardTabComponent} from './dashboard-tab/dashboard-tab.component';
import {NotificationTabComponent} from './notification-tab/notification-tab.component';
import {MultiPlayerTabComponent} from './multi-player-tab/multi-player-tab.component';

@NgModule({
  declarations: [
    ManagerPanelComponent,
    ProjectsTabComponent,
    UsersTabComponent,
    DashboardTabComponent,
    NotificationTabComponent,
    MultiPlayerTabComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RlTagInputModule,
    RouterModule.forChild(ManagerPanelRoutes),
  ],
  providers: []
})
export class ManagerPanelModule {
}
