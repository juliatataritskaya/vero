import {Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {UnauthorizedGuard} from "../shared/guards/unauthorized.guard";

export const MainRoutes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: MainComponent,
    // canActivate: [AuthGuard]
  },
  ];
