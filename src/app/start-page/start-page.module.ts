import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StartPageRoutes} from './start-page.routing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StartPageComponent} from './start-page.component';

@NgModule({
  declarations: [
    StartPageComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(StartPageRoutes),
  ],
  providers: []
})
export class StartPageModule {
}
