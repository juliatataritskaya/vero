import {Route} from '@angular/router';
import {SuperManagerTabComponent} from './super-manager-tab.component';
// import {UnauthorizedGuard} from "../../shared/guards/unauthorized.guard";

export const SuperManagerTabRoutes: Route[] = [
  {path: '', redirectTo: 'super-manager', pathMatch: 'full'},
  {path: 'super-manager', component: SuperManagerTabComponent}
];
