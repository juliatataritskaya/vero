import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RegistrationComponent} from './registration/registration.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from './auth.component';
import {AuthRoutes} from './auth.routing';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AuthComponent,
    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(AuthRoutes),
  ],
  providers: []
})
export class AuthModule {
}
