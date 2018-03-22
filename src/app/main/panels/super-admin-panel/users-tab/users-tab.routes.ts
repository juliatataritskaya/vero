import {Route} from '@angular/router';
import {UsersTabComponent} from './users-tab.component';

export const UsersTabRoutes: Route[] = [
  {path: '', redirectTo: 'user', pathMatch: 'full'},
  {path: 'user', component: UsersTabComponent}
];
