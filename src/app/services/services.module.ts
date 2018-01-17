import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthApiService} from './api/auth.api.service';
import {CustomerApiService} from './api/customer.api.service';
import {PaddleApiService} from './api/paddle.api.service';
import {PaddleService} from './paddle.service';
import {UserApiService} from './api/user.api.service';
import {CustomerService} from './customer.service';
import {UserService} from "./user.service";

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    AuthService,
    CustomerService,
    PaddleService,
    UserService,
    AuthApiService,
    CustomerApiService,
    PaddleApiService,
    UserApiService
  ]
})
export class ServicesModule {
}
