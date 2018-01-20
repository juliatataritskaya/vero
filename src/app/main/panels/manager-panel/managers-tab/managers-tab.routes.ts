import {Route} from '@angular/router';
import {ManagersTabComponent} from './managers-tab.component';

export const ManagersTabRoutes: Route[] = [
  {path: '', redirectTo: 'managers', pathMatch: 'full'},
  {path: 'managers', component: ManagersTabComponent}
];
