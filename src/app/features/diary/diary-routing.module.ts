import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeekCalendarComponent } from './components/week-calendar/week-calendar.component';
import { YearCalendarComponent } from './components/year-calendar/year-calendar.component';

const routes: Routes = [
  { path: '', redirectTo: 'week', pathMatch: 'full' },
  { path: 'week', component: WeekCalendarComponent },
  { path: 'year', component: YearCalendarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaryRoutingModule {}
