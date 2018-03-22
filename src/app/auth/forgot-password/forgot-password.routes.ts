import {Route} from '@angular/router';
import {ForgotPasswordComponent} from './forgot-password.component';

export const ForgotPasswordRoutes: Route[] = [
  {path: '', redirectTo: 'forgot-password', pathMatch: 'full'},
  {path: 'forgot-password', component: ForgotPasswordComponent}
];
