import {Route} from '@angular/router';
import {ProjectsTabComponent} from './projects-tab.component';

export const ProjectsTabRoutes: Route[] = [
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
  {path: 'projects', component: ProjectsTabComponent}
];
