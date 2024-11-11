// src/app/services/notes.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiaryEntry {
  id: number;
  user_id: number;
  date: string;
  content: string;
}

export interface Note {
  id: number;
  user_id: number;
  parent_id: number | null;
  name: string;
  content: string;
  type: 'note' | 'flashcard';
}

export interface Flashcard extends Note {
  items: Array<Note | Flashcard>;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private baseUrl = 'http://localhost:3000'; // Adjust if different

  constructor(private http: HttpClient) {}

  // Diary Entries
  getEntries(): Observable<DiaryEntry[]> {
    return this.http.get<DiaryEntry[]>(`${this.baseUrl}/entries`);
  }

  createEntry(entry: Partial<DiaryEntry>): Observable<DiaryEntry> {
    return this.http.post<DiaryEntry>(`${this.baseUrl}/entries`, entry);
  }

  updateEntry(id: number, entry: Partial<DiaryEntry>): Observable<DiaryEntry> {
    return this.http.put<DiaryEntry>(`${this.baseUrl}/entries/${id}`, entry);
  }

  deleteEntry(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/entries/${id}`);
  }

  // Notes and Flashcards
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrl}/notes`);
  }

  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(`${this.baseUrl}/notes`, note);
  }

  updateNote(id: number, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/notes/${id}`, note);
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notes/${id}`);
  }

  // File Upload
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  // File Download
  downloadFile(key: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${key}`, { responseType: 'blob' });
  }
}
