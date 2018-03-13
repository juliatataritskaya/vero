import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharingProjectComponent} from './sharing-page.component';
import {SharingProjectRoutes} from './sharing-page.routes';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    SharingProjectComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(SharingProjectRoutes),
  ],
  providers: []
})
export class SharingPageModule {
}
