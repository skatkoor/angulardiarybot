import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard.component';

const routes: Routes = [
  { path: '', component: NotesDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesRoutingModule {}
