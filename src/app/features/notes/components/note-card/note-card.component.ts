// src/app/features/notes/components/note-card/note-card.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../../services/notes.service';
import { NotesService } from '../../../services/notes.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent {
  @Input() note!: Note; // Add @Input() decorator to receive 'note' from parent
  @Output() delete = new EventEmitter<number>();

  isEditing: boolean = false;

  constructor(private notesService: NotesService) {}

  editNote() {
    this.isEditing = true;
  }

  saveNote() {
    this.isEditing = false;
    // Implement saving logic here
    this.notesService.updateNote(this.note.id, { name: this.note.name, content: this.note.content }).subscribe(
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

  deleteNote() {
    this.delete.emit(this.note.id);
  }

  uploadFile(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.notesService.uploadFile(file).subscribe(
        response => {
          const fileUrl = response.fileUrl;
          this.note.content += `\n![Image](${fileUrl})`;
          this.notesService.updateNote(this.note.id, { content: this.note.content }).subscribe(
            () => {
              // Optionally, display a success message
            },
            error => {
              // Handle error
            }
          );
        },
        error => {
          // Handle upload error
        }
      );
    }
  }
}
