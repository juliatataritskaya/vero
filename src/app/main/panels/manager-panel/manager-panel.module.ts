import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ManagerPanelComponent} from './manager-panel.component';
import {ManagerPanelRoutes} from './manager-panel.routing';
import {ProjectsTabComponent} from './projects-tab/projects-tab.component';
import {EditorTabComponent} from './editor-projects-tab/editor-tab.component';

@NgModule({
  declarations: [
    ManagerPanelComponent,
    ProjectsTabComponent,
    EditorTabComponent
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
