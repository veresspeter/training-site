import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IAppUser, AppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { ApplicationUserComponent } from './application-user.component';
import { ApplicationUserUpdateComponent } from './update/application-user-update.component';

@Injectable({ providedIn: 'root' })
export class ApplicationUserResolve implements Resolve<IAppUser> {
  constructor(private service: ApplicationUserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((appUser: HttpResponse<AppUser>) => {
          if (appUser.body) {
            return of(appUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AppUser());
  }
}

export const applicationUserRoute: Routes = [
  {
    path: '',
    component: ApplicationUserComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Felhasználók',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationUserUpdateComponent,
    resolve: {
      appUser: ApplicationUserResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Felhasználói adatlap',
    },
    canActivate: [UserRouteAccessService],
  },
];
