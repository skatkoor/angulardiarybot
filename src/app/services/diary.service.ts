import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private baseUrl = 'http://localhost:3000'; // Adjust if your backend runs on a different host or port

  constructor(private http: HttpClient) {}

  getEntries(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/entries`, { headers });
  }

  saveEntry(date: string, content: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/entries`, { date, content }, { headers });
  }
}
