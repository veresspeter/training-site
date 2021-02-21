import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';
import { ActivityTypeComponent } from './activity-type.component';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { ActivityType, IActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ActivityTypeUpdateComponent } from 'app/activity-type/activity-type-update/activity-type-update.component';

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

export const activityTypeRoutes: Routes = [
  {
    path: '',
    component: ActivityTypeComponent,
    data: {
      pageTitle: 'Foglalkozások',
    },
  },
  {
    path: 'new',
    component: ActivityTypeUpdateComponent,
    resolve: {
      activityType: ActivityTypeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'Új foglalkozás',
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
      authorities: [Authority.ADMIN],
      pageTitle: 'Foglalkozás szerkesztése',
    },
    canActivate: [UserRouteAccessService],
  },
];
