import {Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {UnauthorizedGuard} from '../shared/guards/unauthorized.guard';
import {SuperAdminPanelRoutes} from './panels/super-admin-panel/super-admin-panel.routing';
import {ManagerPanelRoutes} from './panels/manager-panel/manager-panel.routing';
import {SuperManagerPanelRoutes} from './panels/super-manager-panel/super-manager-panel.routing';
import {RolesGuard} from '../shared/guards/roles.guard';

export const MainRoutes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: MainComponent, canActivate: [AuthGuard], children: [
    ...SuperAdminPanelRoutes,
    ...SuperManagerPanelRoutes,
    ...ManagerPanelRoutes
  ]},
  {path: 'adminpanel', redirectTo: 'main/adminpanel', pathMatch: 'full'}
  ];
