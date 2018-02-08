import {Route} from '@angular/router';
import {ResetPasswordComponent} from './reset-password.component';

export const ResetPasswordRoutes: Route[] = [
  {path: '', redirectTo: 'reset-password', pathMatch: 'full'},
  {path: 'reset-password', component: ResetPasswordComponent}
];
