import {Route} from '@angular/router';
import {EditorTabComponent} from './editor-tab.component';

export const EditorTabRoutes: Route[] = [
  {path: '', redirectTo: 'editor', pathMatch: 'full'},
  {path: 'editor', component: EditorTabComponent}
];
