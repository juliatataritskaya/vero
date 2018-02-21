import {Route} from '@angular/router';
import {SharingProjectComponent} from './sharing-page.component';

export const SharingProjectRoutes: Route[] = [
  {path: '', redirectTo: 'sharing', pathMatch: 'full'},
  {path: 'sharing', component: SharingProjectComponent}
];
