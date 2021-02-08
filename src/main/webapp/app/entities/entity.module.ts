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
        path: 'activity-type',
        loadChildren: () => import('./activity-type/activity-type.module').then(m => m.MaxmoveActivityTypeModule),
      },
      {
        path: 'activity',
        loadChildren: () => import('./activity/activity.module').then(m => m.MaxmoveActivityModule),
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(m => m.MaxmoveEventModule),
      },
      {
        path: 'pass-type',
        loadChildren: () => import('./pass-type/pass-type.module').then(m => m.MaxmovePassTypeModule),
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
