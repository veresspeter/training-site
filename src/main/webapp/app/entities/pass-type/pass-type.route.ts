import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPassType, PassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from './pass-type.service';
import { PassTypeComponent } from './pass-type.component';
import { PassTypeDetailComponent } from './pass-type-detail.component';
import { PassTypeUpdateComponent } from './pass-type-update.component';

@Injectable({ providedIn: 'root' })
export class PassTypeResolve implements Resolve<IPassType> {
  constructor(private service: PassTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPassType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((passType: HttpResponse<PassType>) => {
          if (passType.body) {
            return of(passType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PassType());
  }
}

export const passTypeRoute: Routes = [
  {
    path: '',
    component: PassTypeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'PassTypes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PassTypeDetailComponent,
    resolve: {
      passType: PassTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'PassTypes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PassTypeUpdateComponent,
    resolve: {
      passType: PassTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'PassTypes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PassTypeUpdateComponent,
    resolve: {
      passType: PassTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'PassTypes',
    },
    canActivate: [UserRouteAccessService],
  },
];
