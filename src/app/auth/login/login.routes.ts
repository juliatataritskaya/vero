import {Route} from '@angular/router';
import {LoginComponent} from './login.component';
import {UnauthorizedGuard} from '../../shared/guards/unauthorized.guard';

export const LoginRoutes: Route[] = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [UnauthorizedGuard]}
];
