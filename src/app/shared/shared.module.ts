import {NgModule} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';
import {UnauthorizedGuard} from './guards/unauthorized.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {RolesGuard} from './guards/roles.guard';
import {ErrorPageModule} from './pages/error/error-page.module';

@NgModule({
  imports: [ErrorPageModule],
  declarations: [],
  exports: [],
  providers: [
    AuthGuard,
    UnauthorizedGuard,
    RolesGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }]
})
export class SharedModule {
}
