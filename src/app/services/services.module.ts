import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthApiService} from './api/auth.api.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    AuthService,
    AuthApiService
  ]
})
export class ServicesModule {
}
