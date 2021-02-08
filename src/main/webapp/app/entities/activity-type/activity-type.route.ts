import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IActivityType, ActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeService } from './activity-type.service';
import { ActivityTypeComponent } from './activity-type.component';
import { ActivityTypeDetailComponent } from './activity-type-detail.component';
import { ActivityTypeUpdateComponent } from './activity-type-update.component';

@Injectable({ providedIn: 'root' })
export class ActivityTypeResolve implements Resolve<IActivityType> {
  constructor(private service: ActivityTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivityType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((activityType: HttpResponse<ActivityType>) => {
          if (activityType.body) {
            return of(activityType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ActivityType());
  }
}

export const activityTypeRoute: Routes = [
  {
    path: '',
    component: ActivityTypeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ActivityTypes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivityTypeDetailComponent,
    resolve: {
      activityType: ActivityTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ActivityTypes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivityTypeUpdateComponent,
    resolve: {
      activityType: ActivityTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ActivityTypes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivityTypeUpdateComponent,
    resolve: {
      activityType: ActivityTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ActivityTypes',
    },
    canActivate: [UserRouteAccessService],
  },
];
