import { Routes } from '@angular/router';
import { TrainerComponent } from 'app/trainer/trainer.component';

export const trainerRoutes: Routes = [
  {
    path: '',
    component: TrainerComponent,
    data: {
      pageTitle: 'Oktatók',
    },
  },
];
