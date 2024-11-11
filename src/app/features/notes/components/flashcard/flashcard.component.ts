// src/app/features/notes/components/flashcard/flashcard.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Flashcard, Note } from '../../../services/notes.service';
import { NotesService } from '../../../services/notes.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent {
  @Input() flashcard!: Flashcard; // Add @Input() decorator to receive 'flashcard' from parent
  @Output() delete = new EventEmitter<number>();

  isEditing: boolean = false;

  constructor(private notesService: NotesService) {}

  editFlashcard() {
    this.isEditing = true;
  }

  saveFlashcard() {
    this.isEditing = false;
    // Implement saving logic here
    this.notesService.updateNote(this.flashcard.id, { name: this.flashcard.name }).subscribe(
      () => {
        // Optionally, display a success message
      },
      error => {
        // Handle error
      }
    );
  }

  cancelEdit() {
    this.isEditing = false;
    // Optionally revert changes if needed
  }

  addNote() {
    const newNote: Partial<Note> = {
      name: 'New Note',
      type: 'note',
      content: '',
      parent_id: this.flashcard.id,
    };
    this.notesService.createNote(newNote).subscribe(
      data => {
        this.flashcard.items.push(data);
        // Optionally, display a success message
      },
      error => {
        // Handle error
      }
    );
  }

  addFlashcard() {
    const newFlashcard: Partial<Flashcard> = {
      name: 'New Flashcard',
      type: 'flashcard',
      content: '',
      items: [],
      parent_id: this.flashcard.id,
    };
    this.notesService.createNote(newFlashcard).subscribe(
      data => {
        this.flashcard.items.push(data);
        // Optionally, display a success message
      },
      error => {
        // Handle error
      }
    );
  }

  deleteFlashcard() {
    this.delete.emit(this.flashcard.id);
  }

  deleteItem(id: number) {
    this.flashcard.items = this.flashcard.items.filter(item => item.id !== id);
    // Optionally, send a delete request to the backend
    this.notesService.deleteNote(id).subscribe(
      () => {
        // Optionally, display a success message
      },
      error => {
        // Handle error
      }
    );
  }

  uploadFile(event: any, noteId: number) {
    const file: File = event.target.files[0];
    if (file) {
      this.notesService.uploadFile(file).subscribe(
        response => {
          const fileUrl = response.fileUrl;
          const note = this.flashcard.items.find(item => item.id === noteId && item.type === 'note') as Note;
          if (note) {
            note.content += `\n![Image](${fileUrl})`;
            this.notesService.updateNote(note.id, { content: note.content }).subscribe(
              () => {
                // Optionally, display a success message
              },
              error => {
                // Handle error
              }
            );
          }
        },
        error => {
          // Handle upload error
        }
      );
    }
  }
}
