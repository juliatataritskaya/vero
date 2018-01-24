import {Routes} from '@angular/router';
import {SuperAdminPanelComponent} from './super-admin-panel.component';
import {UsersTabRoutes} from './users-tab/users-tab.routes';
import {CompaniesTabRoutes} from './companies-tab/companies-tab.routes';
import {AuthGuard} from '../../../shared/guards/auth.guard';

export const SuperAdminPanelRoutes: Routes = [
  {path: '', redirectTo: 'adminpanel', pathMatch: 'full'},
  {path: 'adminpanel', component: SuperAdminPanelComponent, canActivate: [AuthGuard], children: [
    ...CompaniesTabRoutes,
    ...UsersTabRoutes
  ]},
  ];
