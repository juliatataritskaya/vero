import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthApiService} from './api/auth.api.service';
import {ManagerApiService} from './api/manager.api.service';
import {ManagerService} from './manager.service';
import {RedirectService} from './redirect.service';
import {DashboardService} from './dashboard.service';
import {UserApiService} from './api/user.api.service';
import {UserService} from './user.service';
import {NotificationApiService} from './api/notification.api.service';
import {NotificationService} from './notification.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    AuthService,
    AuthApiService,
    ManagerApiService,
    ManagerService,
    RedirectService,
    DashboardService,
    UserApiService,
    UserService,
    NotificationApiService,
    NotificationService
  ]
})
export class ServicesModule {
}
