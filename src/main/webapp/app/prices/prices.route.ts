import { Routes } from '@angular/router';
import { PricesComponent } from 'app/prices/prices.component';

export const pricesRoutes: Routes = [
  {
    path: '',
    component: PricesComponent,
    data: {
      pageTitle: 'Árak',
    },
  },
];
