import {Route} from '@angular/router';
import {SharingTabComponent} from './sharing-tab.component';

export const SharingTabRoutes: Route[] = [
  // {path: '', redirectTo: 'sharing/:token', pathMatch: 'full'},
  // {path: '', redirectTo: 'sharing/:token/:userId', pathMatch: 'full'},
  {path: 'sharing', component: SharingTabComponent},
  {path: 'sharing', component: SharingTabComponent}
];
