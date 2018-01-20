import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthApiService} from './api/auth.api.service';
import {ManagerApiService} from './api/manager.api.service';
import {ManagerService} from './manager.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    AuthService,
    AuthApiService,
    ManagerApiService,
    ManagerService
  ]
})
export class ServicesModule {
}
