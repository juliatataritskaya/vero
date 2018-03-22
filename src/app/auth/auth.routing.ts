import {Routes} from '@angular/router';
import {LoginRoutes} from './login/login.routes';
import {AuthComponent} from './auth.component';
import {ForgotPasswordRoutes} from './forgot-password/forgot-password.routes';
import {ResetPasswordRoutes} from './reset-password/reset-password.routes';

export const AuthRoutes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent, children: [
    ...LoginRoutes,
    ...ForgotPasswordRoutes,
    ...ResetPasswordRoutes
  ]
  },
  ];
