import { Routes } from '@angular/router';
import { ContactComponent } from 'app/contact/contact.component';

export const contactRoutes: Routes = [
  {
    path: '',
    component: ContactComponent,
    data: {
      pageTitle: 'Kapcsolat',
    },
  },
];
