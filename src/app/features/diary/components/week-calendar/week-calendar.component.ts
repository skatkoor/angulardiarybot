import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Quill from 'quill';

@Component({
  selector: 'app-week-calendar',
  templateUrl: './week-calendar.component.html',
  styleUrls: ['./week-calendar.component.scss'],
})
export class WeekCalendarComponent implements OnInit {
  currentDate: Date = new Date();
  weekDates: Date[] = [];
  entriesMap: { [key: string]: string } = {};
  selectedDate: Date = new Date();
  selectedEntryContent: string = '';

  quillModules = {
    toolbar: [
      [{ 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['clean'],
    ],
  };

  private editor: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.selectedDate = new Date(params['date']);
        this.currentDate = new Date(this.selectedDate);
      } else {
        this.selectedDate = new Date();
      }
      this.updateWeek();
      this.selectDate(this.selectedDate);
    });
  }

  updateWeek() {
    this.generateWeekDates();
  }

  previousWeek() {
    this.currentDate = new Date(this.currentDate.getTime() - 7 * 86400000);
    this.updateWeek();
  }

  nextWeek() {
    this.currentDate = new Date(this.currentDate.getTime() + 7 * 86400000);
    this.updateWeek();
  }

  generateWeekDates() {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.weekDates = Array.from({ length: 7 }, (_, i) =>
      new Date(startOfWeek.getTime() + i * 86400000)
    );
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    const dateKey = this.formatDateKey(date);
    this.selectedEntryContent = this.entriesMap[dateKey] || '';
  }

  saveEntry() {
    const dateKey = this.formatDateKey(this.selectedDate);
    this.entriesMap[dateKey] = this.selectedEntryContent;
  }

  formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  hasEntry(date: Date): boolean {
    const dateKey = this.formatDateKey(date);
    return !!this.entriesMap[dateKey];
  }

  onEditorCreated(editor: any) {
    this.editor = editor;
    // Set the initial format to bullet list
    editor.format('list', 'bullet');
  }
}
