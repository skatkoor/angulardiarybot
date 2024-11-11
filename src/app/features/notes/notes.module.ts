// src/app/features/notes/notes.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesRoutingModule } from './notes-routing.module';
import { FormsModule } from '@angular/forms';

import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard.component';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { FlashcardComponent } from './components/flashcard/flashcard.component';

@NgModule({
  declarations: [
    NotesDashboardComponent,
    NoteCardComponent,
    FlashcardComponent,
    // Include any other components related to the Notes feature
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    FormsModule,
    // Include any other necessary modules
  ],
})
export class NotesModule {}
