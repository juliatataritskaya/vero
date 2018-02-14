import {Routes} from '@angular/router';
import {StartPageComponent} from './start-page.component';
import {AuthGuard} from '../shared/guards/auth.guard';

export const StartPageRoutes: Routes = [
  {path: '', component: StartPageComponent, pathMatch: 'full'},
  {
    path: 'start-page', component: StartPageComponent, canActivate: [AuthGuard]
  }];
