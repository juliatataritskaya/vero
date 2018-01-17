import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {MainRoutes} from './main.routing';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MainRoutes),
  ],
  providers: []
})
export class MainModule {
}
