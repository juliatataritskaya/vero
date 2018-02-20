import {Route} from '@angular/router';
import {MultiPlayerTabComponent} from './multi-player-tab.component';

export const MultiPlayerTabRoutes: Route[] = [
  {path: '', redirectTo: 'multi-player', pathMatch: 'full'},
  {path: 'multi-player', component: MultiPlayerTabComponent}
];
