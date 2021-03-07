import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { IPassType, PassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { PassTypeDetailComponent } from 'app/prices/pass-type-details/pass-type-detail.component';
import { PassTypeUpdateComponent } from 'app/prices/pass-type-update/pass-type-update.component';
import { PricesComponent } from 'app/prices/prices.component';

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

export const pricesRoutes: Routes = [
  {
    path: '',
    component: PricesComponent,
    data: {
      pageTitle: 'Árak',
    },
  },
  {
    path: ':id/view',
    component: PassTypeDetailComponent,
    resolve: {
      passType: PassTypeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
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
      authorities: [Authority.ADMIN],
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
