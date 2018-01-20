import {Route} from '@angular/router';
import {UsersTabComponent} from './users-tab.component';
// import {UnauthorizedGuard} from "../../shared/guards/unauthorized.guard";

export const UsersTabRoutes: Route[] = [
  {path: '', redirectTo: 'user', pathMatch: 'full'},
  {path: 'user', component: UsersTabComponent}
];
