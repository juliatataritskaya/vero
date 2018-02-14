import {Route} from '@angular/router';
import {ManagerTabComponent} from './manager-tab.component';
// import {UnauthorizedGuard} from "../../shared/guards/unauthorized.guard";

export const ManagerTabRoutes: Route[] = [
  {path: '', redirectTo: 'manager', pathMatch: 'full'},
  {path: 'manager', component: ManagerTabComponent}
];
