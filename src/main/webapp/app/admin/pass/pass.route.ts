import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPass, Pass } from 'app/shared/model/pass.model';
import { PassComponent } from './pass.component';
import { PassUpdateComponent } from './pass-update/pass-update.component';
import { PassService } from 'app/shared/services/pass.service';

@Injectable({ providedIn: 'root' })
export class PassResolve implements Resolve<IPass> {
  constructor(private service: PassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPass> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((pass: HttpResponse<Pass>) => {
          if (pass.body) {
            return of(pass.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pass());
  }
}

export const passRoute: Routes = [
  {
    path: '',
    component: PassComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Passes',
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PassUpdateComponent,
    resolve: {
      pass: PassResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Passes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PassUpdateComponent,
    resolve: {
      pass: PassResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Passes',
    },
    canActivate: [UserRouteAccessService],
  },
];
