import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'application-user',
        loadChildren: () => import('./application-user/application-user.module').then(m => m.MaxmoveApplicationUserModule),
      },
      {
        path: 'pass',
        loadChildren: () => import('./pass/pass.module').then(m => m.MaxmovePassModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class MaxmoveEntityModule {}
