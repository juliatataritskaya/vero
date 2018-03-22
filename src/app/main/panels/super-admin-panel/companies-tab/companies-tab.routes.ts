import {Route} from '@angular/router';
import {CompaniesTabComponent} from './companies-tab.component';

export const CompaniesTabRoutes: Route[] = [
  {path: '', redirectTo: 'company', pathMatch: 'full'},
  {path: 'company', component: CompaniesTabComponent}
];
