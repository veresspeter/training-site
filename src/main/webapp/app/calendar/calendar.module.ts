import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { CALENDAR_ROUTE } from 'app/calendar/calendar.route';

@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule, RouterModule.forChild([CALENDAR_ROUTE])],
})
export class CalendarModule {}
