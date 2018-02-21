import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharingProjectComponent} from './sharing-page.component';
import {SharingProjectRoutes} from './sharing-page.routes';

@NgModule({
  declarations: [
    SharingProjectComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(SharingProjectRoutes),
  ],
  providers: []
})
export class SharingPageModule {
}
