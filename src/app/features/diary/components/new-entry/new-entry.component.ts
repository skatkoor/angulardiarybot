import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss'],
})
export class NewEntryComponent implements OnInit {
  mood: string = 'neutral';
  content: string = '';
  date: Date = new Date();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const dateParam = this.route.snapshot.queryParamMap.get('date');
    if (dateParam) {
      this.date = new Date(dateParam);
    }
  }

  saveEntry() {
    // Save the entry (here we just log it and navigate back)
    console.log('New Entry:', { date: this.date, mood: this.mood, content: this.content });
    this.router.navigate(['/diary']);
  }
}
