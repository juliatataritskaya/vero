import {Routes} from '@angular/router';
import {SuperAdminPanelComponent} from './super-admin-panel.component';
import {UsersTabRoutes} from './users-tab/users-tab.routes';
import {CompaniesTabRoutes} from './companies-tab/companies-tab.routes';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {DashboardTabRoutes} from './dashboard-tab/dashboard-tab.routes';
import {ProjectsTabRoutes} from './projects-tab/projects-tab.routes';
import {SuperManagerTabRoutes} from './super-manager-tab/super-manager-tab.routes';
import {ManagerTabRoutes} from './manager-tab/manager-tab.routes';
import {NotificationTabRoutes} from './notification-tab/notification-tab.routes';
import {RolesGuard} from "../../../shared/guards/roles.guard";

export const SuperAdminPanelRoutes: Routes = [
  {path: '', redirectTo: 'adminpanel', pathMatch: 'full'},
  {path: 'adminpanel', component: SuperAdminPanelComponent, canActivate: [AuthGuard, RolesGuard], data: {
    expectedRole: 'SuperAdmin'
  }, children: [
    ...DashboardTabRoutes,
    ...CompaniesTabRoutes,
    ...UsersTabRoutes,
    ...ProjectsTabRoutes,
    ...SuperManagerTabRoutes,
    ...ManagerTabRoutes,
    ...NotificationTabRoutes
  ]},
  ];
