import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StartPageRoutes} from './start-page/start-page.routing';
import {AuthRoutes} from './auth/auth.routing';
import {MainRoutes} from './main/main.routing';
import {AuthGuard} from './shared/guards/auth.guard';
import {SharingTabRoutes} from './shared/pages/sharing/sharing-tab.routes';

const routes: Routes = [
  {path: '', redirectTo: 'start-page', canActivate: [AuthGuard], pathMatch: 'full'},
  ...StartPageRoutes,
  ...AuthRoutes,
  ...MainRoutes,
  ...SharingTabRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
