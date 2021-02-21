import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/shared/constants/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          redirectTo: 'calendar',
          pathMatch: 'full',
        },
        {
          path: 'activity-type',
          loadChildren: () => import('./activity-type/activity-type.module').then(m => m.MaxmoveActivityTypeModule),
        },
        {
          path: 'calendar',
          loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
        },
        {
          path: 'trainers',
          loadChildren: () => import('./trainer/trainer.module').then(m => m.TrainerModule),
        },
        {
          path: 'prices',
          loadChildren: () => import('./prices/prices.module').then(m => m.PricesModule),
        },
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        ...LAYOUT_ROUTES,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class MaxmoveAppRoutingModule {}
