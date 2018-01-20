import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ManagerPanelComponent} from './manager-panel.component';
import {ManagerPanelRoutes} from './manager-panel.routing';
import {ProjectsTabComponent} from './projects-tab/projects-tab.component';
import {ManagersTabComponent} from './managers-tab/managers-tab.component';

@NgModule({
  declarations: [
    ManagerPanelComponent,
    ProjectsTabComponent,
    ManagersTabComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(ManagerPanelRoutes),
  ],
  providers: []
})
export class ManagerPanelModule {
}
