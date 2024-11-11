// src/app/features/notes/components/notes-dashboard/notes-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { NotesService, Note, Flashcard } from '../../../../services/notes.service';

@Component({
  selector: 'app-notes-dashboard',
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss'],
})
export class NotesDashboardComponent implements OnInit {
  notes: Array<Note | Flashcard> = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.fetchNotes();
  }

  fetchNotes(): void {
    this.notesService.getNotes().subscribe(
      (data: Note[]) => {
        this.notes = data;
      },
      (error: any) => {
        this.errorMessage = error.error.message || 'Failed to fetch notes.';
      }
    );
  }

  addNote(): void {
    const newNote: Partial<Note> = {
      name: 'New Note',
      type: 'note',
      title: 'New Note',
      content: '',
    };
    this.notesService.createNote(newNote).subscribe(
      (data: Note) => {
        this.notes.unshift(data);
        this.successMessage = 'Note created successfully.';
        this.errorMessage = '';
      },
      (error: any) => {
        this.errorMessage = error.error.message || 'Failed to create note.';
        this.successMessage = '';
      }
    );
  }

  addFlashcard(): void {
    const newFlashcard: Partial<Flashcard> = {
      name: 'New Flashcard',
      type: 'flashcard',
      items: [],
    };
    this.notesService.createNote(newFlashcard).subscribe(
      (data: Flashcard) => {
        this.notes.unshift(data);
        this.successMessage = 'Flashcard created successfully.';
        this.errorMessage = '';
      },
      (error: any) => {
        this.errorMessage = error.error.message || 'Failed to create flashcard.';
        this.successMessage = '';
      }
    );
  }

  deleteItem(id: number): void {
    this.notesService.deleteNote(id).subscribe(
      () => {
        this.notes = this.notes.filter(item => item.id !== id);
        this.successMessage = 'Item deleted successfully.';
        this.errorMessage = '';
      },
      (error: any) => {
        this.errorMessage = error.error.message || 'Failed to delete item.';
        this.successMessage = '';
      }
    );
  }

  uploadFile(event: any, noteId: number): void {
    const file: File = event.target.files[0];
    if (file) {
      this.notesService.uploadFile(file).subscribe(
        (response: any) => {
          // Optionally, store the file URL in the note's content or a separate field
          // For example, appending the file URL to the content
          const fileUrl: string = response.fileUrl;
          const note: Note | undefined = this.notes.find(
            n => n.id === noteId && n.type === 'note'
          ) as Note;
          if (note) {
            note.content += `\n![Image](${fileUrl})`;
            this.notesService.updateNote(note.id, { content: note.content }).subscribe(
              () => {
                this.successMessage = 'File uploaded and linked successfully.';
                this.errorMessage = '';
                this.fetchNotes(); // Refresh notes
              },
              (error: any) => {
                this.errorMessage = error.error.message || 'Failed to update note with file.';
                this.successMessage = '';
              }
            );
          }
        },
        (error: any) => {
          this.errorMessage = error.error.message || 'File upload failed.';
          this.successMessage = '';
        }
      );
    }
  }
}
