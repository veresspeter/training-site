import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { calendarRoutes } from 'app/calendar/calendar.route';
import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { EventComponent } from 'app/calendar/event.component';
import { EventUpdateComponent } from 'app/calendar/event-update/event-update.component';
import { EventDetailComponent } from 'app/calendar/event-detail/event-detail.component';
import { EventDeleteDialogComponent } from 'app/calendar/event-delete/event-delete-dialog.component';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(calendarRoutes)],
  declarations: [EventComponent, EventDetailComponent, EventUpdateComponent, EventDeleteDialogComponent],
  entryComponents: [EventDeleteDialogComponent],
})
export class CalendarModule {}
