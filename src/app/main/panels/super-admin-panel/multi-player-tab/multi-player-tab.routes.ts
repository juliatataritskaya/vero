import {Route} from '@angular/router';
import {MultiPlayerTabComponent} from './multi-player-tab.component';

export const MultiPlayerTabRoutes: Route[] = [
  {path: '', redirectTo: 'vr-tracking', pathMatch: 'full'},
  {path: 'vr-tracking', component: MultiPlayerTabComponent}
];
