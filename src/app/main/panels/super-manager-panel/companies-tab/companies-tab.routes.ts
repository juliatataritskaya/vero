import {Route} from '@angular/router';
import {CompaniesTabComponent} from './companies-tab.component';
// import {UnauthorizedGuard} from '../../shared/guards/unauthorized.guard';

export const CompaniesTabRoutes: Route[] = [
  {path: '', redirectTo: 'company', pathMatch: 'full'},
  {path: 'company', component: CompaniesTabComponent}
];
