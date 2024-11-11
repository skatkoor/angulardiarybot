import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  viewMode: 'week' | 'year' = 'week';

  onViewModeChange(mode: 'week' | 'year') {
    this.viewMode = mode;
  }
}
