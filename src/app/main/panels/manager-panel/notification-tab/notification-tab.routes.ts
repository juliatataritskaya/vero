import {Route} from '@angular/router';
import {NotificationTabComponent} from './notification-tab.component';
// import {UnauthorizedGuard} from "../../shared/guards/unauthorized.guard";

export const NotificationTabRoutes: Route[] = [
  {path: '', redirectTo: 'notification', pathMatch: 'full'},
  {path: 'notification', component: NotificationTabComponent}
];
