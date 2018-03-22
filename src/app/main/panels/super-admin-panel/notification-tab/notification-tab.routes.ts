import {Route} from '@angular/router';
import {NotificationTabComponent} from './notification-tab.component';

export const NotificationTabRoutes: Route[] = [
  {path: '', redirectTo: 'notification', pathMatch: 'full'},
  {path: 'notification', component: NotificationTabComponent}
];
