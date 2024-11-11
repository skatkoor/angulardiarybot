import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryRoutingModule } from './diary-routing.module';

import { WeekCalendarComponent } from './components/week-calendar/week-calendar.component';
import { YearCalendarComponent } from './components/year-calendar/year-calendar.component';

import { NgIconsModule } from '@ng-icons/core';
import { QuillModule } from 'ngx-quill';

import {
  heroChevronLeftSolid,
  heroChevronRightSolid,
} from '@ng-icons/heroicons/solid';

@NgModule({
  declarations: [
    WeekCalendarComponent,
    YearCalendarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DiaryRoutingModule,
    QuillModule.forRoot(),
    NgIconsModule.withIcons({
      heroChevronLeftSolid,
      heroChevronRightSolid,
    }),
  ],
  exports: [
    WeekCalendarComponent,
    YearCalendarComponent,
  ],
})
export class DiaryModule {}
