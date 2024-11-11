// src/app/features/diary/components/diary-entry/diary-entry.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diary-entry',
  templateUrl: './diary-entry.component.html',
  styleUrls: ['./diary-entry.component.scss'],
})
export class DiaryEntryComponent implements OnInit {
  entry: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const entryId = this.route.snapshot.paramMap.get('id');
    // Fetch entry based on entryId (using dummy data here)
    this.entry = {
      id: entryId,
      date: new Date(),
      content: 'This is the content of the diary entry.',
    };
  }
}
