import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'application-user',
        loadChildren: () => import('./application-user/application-user.module').then(m => m.MaxmoveApplicationUserModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class MaxmoveEntityModule {}
