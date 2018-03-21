import {Route} from '@angular/router';
import {ForgotPasswordComponent} from './forgot-password.component';
import {UnauthorizedGuard} from '../../shared/guards/unauthorized.guard';

export const ForgotPasswordRoutes: Route[] = [
  {path: '', redirectTo: 'forgot-password', pathMatch: 'full'},
  {path: 'forgot-password', component: ForgotPasswordComponent}
];
