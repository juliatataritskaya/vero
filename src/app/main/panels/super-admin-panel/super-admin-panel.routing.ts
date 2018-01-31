import {Routes} from '@angular/router';
import {SuperAdminPanelComponent} from './super-admin-panel.component';
import {UsersTabRoutes} from './users-tab/users-tab.routes';
import {CompaniesTabRoutes} from './companies-tab/companies-tab.routes';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {DashboardTabRoutes} from './dashboard-tab/dashboard-tab.routes';
import {ProjectsTabRoutes} from './projects-tab/projects-tab.routes';

export const SuperAdminPanelRoutes: Routes = [
  {path: '', redirectTo: 'adminpanel', pathMatch: 'full'},
  {path: 'adminpanel', component: SuperAdminPanelComponent, canActivate: [AuthGuard], children: [
    ...DashboardTabRoutes,
    ...CompaniesTabRoutes,
    ...UsersTabRoutes,
    ...ProjectsTabRoutes
  ]},
  ];
