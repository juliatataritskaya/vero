import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RegistrationComponent} from '../auth/registration/registration.component';
import {StartPageRoutes} from './start-page.routing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from '../auth/login/login.component';
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
