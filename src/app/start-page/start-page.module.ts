import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {RegistrationComponent} from './registration/registration.component';
import {AuthRoutes} from './auth.routing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot_password/forgot-password.component';
import {SetNewPasswordComponent} from './set-new-password/set-new-passwordcomponent';


@NgModule({
  declarations: [
    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SetNewPasswordComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  providers: []
})
export class AuthModule {
}
