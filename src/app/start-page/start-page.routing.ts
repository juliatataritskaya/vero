import {Routes} from '@angular/router';
import {RegistrationComponent} from './registration/registration.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot_password/forgot-password.component';
import {SetNewPasswordComponent} from './set-new-password/set-new-passwordcomponent';

export const AuthRoutes: Routes = [{
  path: 'registration',
  component: RegistrationComponent
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'forgot-password',
  component: ForgotPasswordComponent
}, {
  path: 'set-new-password',
  component: SetNewPasswordComponent
}, {
  path: '**',
  redirectTo: 'login'
}];
