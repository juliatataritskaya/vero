import {Routes} from '@angular/router';
import {LoginRoutes} from './login/login.routes';
import {RegistrationRoutes} from './registration/registration.routes';
import {AuthComponent} from './auth.component';
import {UnauthorizedGuard} from '../shared/guards/unauthorized.guard';
import {ForgotPasswordRoutes} from './forgot-password/forgot-password.routes';
import {ResetPasswordRoutes} from './reset-password/reset-password.routes';

export const AuthRoutes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent, canActivate: [UnauthorizedGuard], children: [
    ...LoginRoutes,
    ...RegistrationRoutes,
    ...ForgotPasswordRoutes,
    ...ResetPasswordRoutes
  ]
  },
  ];
