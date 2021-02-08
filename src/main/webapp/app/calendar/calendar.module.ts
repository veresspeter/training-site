import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';

import { RouterModule } from '@angular/router';
import { CALENDAR_ROUTE } from 'app/calendar/calendar.route';
import { MaxmoveSharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild([CALENDAR_ROUTE])],
  declarations: [CalendarComponent],
})
export class CalendarModule {}
