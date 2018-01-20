import {Routes} from '@angular/router';
import {ManagerPanelComponent} from './manager-panel.component';
import {ProjectsTabRoutes} from './projects-tab/projects-tab.routes';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {RolesGuard} from '../../../shared/guards/roles.guard';
import {EditorTabRoutes} from './editor-projects-tab/editor-tab.routes';

export const ManagerPanelRoutes: Routes = [
  {path: '', redirectTo: 'managerpanel', pathMatch: 'full'},
  {path: 'managerpanel', component: ManagerPanelComponent, canActivate: [AuthGuard, RolesGuard], children: [
    ...ProjectsTabRoutes,
    ...EditorTabRoutes
  ]},
  ];
