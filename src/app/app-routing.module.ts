import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InputScreenComponent} from './input-screen/input-screen.component';
import {EditorComponent} from './editor/editor.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'input-screen',
    pathMatch: 'full'
  },
  {
    path: 'input-screen',
    component: InputScreenComponent
  },
  {
    path: 'editor',
    component: EditorComponent,
    data: {project: false}
  },
  {
    path: 'editor/project',
    component: EditorComponent,
    data: {project: true}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
