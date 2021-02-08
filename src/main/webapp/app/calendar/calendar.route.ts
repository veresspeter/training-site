import { Route } from '@angular/router';

import { CalendarComponent } from './calendar.component';

export const CALENDAR_ROUTE: Route = {
  path: 'calendar',
  component: CalendarComponent,
  data: {
    authorities: [],
    pageTitle: 'Órarend',
  },
};
