import { Routes } from '@angular/router';

import { activateRoute } from './activate/activate.route';
import { passwordRoute } from './password/password.route';
import { passwordResetFinishRoute } from './password-reset/finish/password-reset-finish.route';
import { passwordResetInitRoute } from './password-reset/init/password-reset-init.route';
import { registerRoute } from './register/register.route';
import { sessionsRoute } from './sessions/sessions.route';
import { settingsRoute } from './settings/settings.route';
import { MyEventsComponent } from 'app/account/my-events/my-events.component';
import { MyPassesComponent } from 'app/account/my-passes/my-passes.component';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';

const ACCOUNT_ROUTES = [
  activateRoute,
  passwordRoute,
  passwordResetFinishRoute,
  passwordResetInitRoute,
  registerRoute,
  sessionsRoute,
  settingsRoute,
];

export const accountState: Routes = [
  {
    path: '',
    children: ACCOUNT_ROUTES,
  },
  {
    path: 'my-events',
    component: MyEventsComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Közelgő óráim',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'my-passes',
    component: MyPassesComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Bérleteim',
    },
    canActivate: [UserRouteAccessService],
  },
];
