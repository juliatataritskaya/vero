import {Routes} from '@angular/router';
import {StartPageComponent} from './start-page.component';
import {LoginRoutes} from '../auth/login/login.routes';
import {RegistrationRoutes} from '../auth/registration/registration.routes';

export const StartPageRoutes: Routes = [
  {path: '', component: StartPageComponent, pathMatch: 'full'},
  {
    path: 'start-page', component: StartPageComponent
  }];
