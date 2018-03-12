import {Route} from '@angular/router';
import {DashboardTabComponent} from './dashboard-tab.component';
import {RolesGuard} from "../../../../shared/guards/roles.guard";

export const DashboardTabRoutes: Route[] = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardTabComponent}
];
