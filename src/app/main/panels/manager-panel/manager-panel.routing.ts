import {Routes} from '@angular/router';
import {ManagerPanelComponent} from './manager-panel.component';
import {ProjectsTabRoutes} from './projects-tab/projects-tab.routes';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {UsersTabRoutes} from './users-tab/users-tab.routes';

export const ManagerPanelRoutes: Routes = [
  {path: '', redirectTo: 'managerpanel', pathMatch: 'full'},
  {path: 'managerpanel', component: ManagerPanelComponent, canActivate: [AuthGuard], children: [
    ...ProjectsTabRoutes,
    ...UsersTabRoutes
  ]},
  ];
