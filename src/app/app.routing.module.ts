import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StartPageRoutes} from './start-page/start-page.routing';
import {AuthRoutes} from './auth/auth.routing';
import {MainRoutes} from './main/main.routing';

const routes: Routes = [
  {path: '', redirectTo: 'start-page', pathMatch: 'full'},
  ...StartPageRoutes,
  ...AuthRoutes,
  ...MainRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
