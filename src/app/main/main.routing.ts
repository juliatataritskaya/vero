import {Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {UnauthorizedGuard} from '../shared/guards/unauthorized.guard';
import {SuperAdminPanelRoutes} from './panels/super-admin-panel/super-admin-panel.routing';
import {ManagerPanelRoutes} from './panels/manager-panel/manager-panel.routing';

export const MainRoutes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: MainComponent, canActivate: [AuthGuard], children: [
    ...SuperAdminPanelRoutes,
    ...ManagerPanelRoutes
  ]},
  ];
