import {Route} from '@angular/router';
import {ManagerTabComponent} from './manager-tab.component';

export const ManagerTabRoutes: Route[] = [
  {path: '', redirectTo: 'manager', pathMatch: 'full'},
  {path: 'manager', component: ManagerTabComponent}
];
