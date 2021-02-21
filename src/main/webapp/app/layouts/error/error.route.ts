import { Routes } from '@angular/router';

import { ErrorComponent } from './error.component';

export const errorRoute: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    data: {
      authorities: [],
      pageTitle: 'Hiba oldal!',
    },
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      authorities: [],
      pageTitle: 'Hiba oldal!',
      errorMessage: 'Nincs jogosultságod ennek az oldalnak a megtekintésére',
    },
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      authorities: [],
      pageTitle: 'Hiba oldal!',
      errorMessage: 'A keresett oldal nem található.',
    },
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
