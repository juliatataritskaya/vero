import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StartPageRoutes} from './start-page/start-page.routing';

const routes: Routes = [
  {path: '', redirectTo: 'start-page', pathMatch: 'full'},
  ...StartPageRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRouting {
}
