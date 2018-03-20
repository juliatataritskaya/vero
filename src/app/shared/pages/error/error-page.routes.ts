import {Route} from '@angular/router';
import {ErrorPageComponent} from './error-page.component';

export const ErrorPageRoutes: Route[] = [
  {path: '', redirectTo: 'error-page', pathMatch: 'full'},
  {path: 'error-page', component: ErrorPageComponent}
];
