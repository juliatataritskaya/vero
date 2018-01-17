import {Route} from '@angular/router';
import {RegistrationComponent} from './registration.component';

export const RegistrationRoutes: Route[] = [
  {path: '', redirectTo: 'registration', pathMatch: 'full'},
  {path: 'registration', component: RegistrationComponent, canActivate: []}
];
