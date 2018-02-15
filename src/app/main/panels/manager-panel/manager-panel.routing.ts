import {Routes} from '@angular/router';
import {ManagerPanelComponent} from './manager-panel.component';
import {ProjectsTabRoutes} from './projects-tab/projects-tab.routes';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {UsersTabRoutes} from './users-tab/users-tab.routes';
import {DashboardTabRoutes} from './dashboard-tab/dashboard-tab.routes';
import {RolesGuard} from '../../../shared/guards/roles.guard';

export const ManagerPanelRoutes: Routes = [
  {path: '', redirectTo: 'managerpanel', pathMatch: 'full'},
  {
    path: 'managerpanel', component: ManagerPanelComponent, canActivate: [AuthGuard], data: {
    expectedRole: 'Manager'
  }, children: [
    ...ProjectsTabRoutes,
    ...UsersTabRoutes,
    ...DashboardTabRoutes
  ]
  },
];
