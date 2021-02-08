import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { calendarRoutes } from 'app/calendar/calendar.route';
import { MaxmoveSharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(calendarRoutes)],
})
export class CalendarModule {}
