import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ErrorPageComponent} from './error-page.component';
import {ErrorPageRoutes} from './error-page.routes';

@NgModule({
  declarations: [
    ErrorPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ErrorPageRoutes),
  ],
  providers: []
})
export class ErrorPageModule {
}
