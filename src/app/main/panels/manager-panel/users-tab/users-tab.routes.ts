import {Route} from '@angular/router';
import {UsersTabComponent} from './users-tab.component';

export const UsersTabRoutes: Route[] = [
  {path: '', redirectTo: 'users', pathMatch: 'full'},
  {path: 'users', component: UsersTabComponent}
];
