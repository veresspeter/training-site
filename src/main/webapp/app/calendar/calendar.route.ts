import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';

import { EventComponent } from 'app/calendar/event.component';
import { EventUpdateComponent } from 'app/calendar/event-update/event-update.component';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Event, IEvent } from 'app/shared/model/event.model';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventService } from 'app/shared/services/event.service';
import { EventDetailComponent } from 'app/calendar/event-detail/event-detail.component';

@Injectable({ providedIn: 'root' })
export class EventResolve implements Resolve<IEvent> {
  constructor(private service: EventService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEvent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((event: HttpResponse<Event>) => {
          if (event.body) {
            return of(event.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Event());
  }
}

export const calendarRoutes: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      pageTitle: 'Órarend',
    },
  },
  {
    path: 'new',
    component: EventUpdateComponent,
    resolve: {
      event: EventResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'Esemény létrehozása',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventUpdateComponent,
    resolve: {
      event: EventResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'Esemény szerkesztése',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventDetailComponent,
    resolve: {
      event: EventResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Events',
    },
    canActivate: [UserRouteAccessService],
  },
];
