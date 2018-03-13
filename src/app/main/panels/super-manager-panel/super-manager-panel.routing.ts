import {Routes} from '@angular/router';
import {SuperManagerPanelComponent} from './super-manager-panel.component';
import {UsersTabRoutes} from './users-tab/users-tab.routes';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {DashboardTabRoutes} from './dashboard-tab/dashboard-tab.routes';
import {ProjectsTabRoutes} from './projects-tab/projects-tab.routes';
import {ManagerTabRoutes} from './manager-tab/manager-tab.routes';
import {NotificationTabRoutes} from './notification-tab/notification-tab.routes';
import {RolesGuard} from '../../../shared/guards/roles.guard';
import {MultiPlayerTabRoutes} from './multi-player-tab/multi-player-tab.routes';

export const SuperManagerPanelRoutes: Routes = [
  {path: '', redirectTo: 'supermanagerpanel', pathMatch: 'full'},
  {
    path: 'supermanagerpanel', component: SuperManagerPanelComponent, canActivate: [AuthGuard, RolesGuard], data: {
    expectedRole: 'SuperManager'
  }, children: [
    ...DashboardTabRoutes,
    ...UsersTabRoutes,
    ...ProjectsTabRoutes,
    ...ManagerTabRoutes,
    ...NotificationTabRoutes,
    ...MultiPlayerTabRoutes
  ]
  },
];
