import {NgModule} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {UnauthorizedGuard} from './guards/unauthorized.guard';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    AuthGuard,
    UnauthorizedGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ]
})
export class SharedModule {
}
