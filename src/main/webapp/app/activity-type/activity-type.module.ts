import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { activityTypeRoutes } from './activity-type.route';
import { ActivityTypeComponent } from './activity-type.component';
import { ActivityTypeUpdateComponent } from 'app/activity-type/activity-type-update/activity-type-update.component';
import { ActivityTypeDeleteDialogComponent } from 'app/activity-type/activity-type-delete/activity-type-delete-dialog.component';
import { ActivityDeleteDialogComponent } from 'app/activity-type/activity-delete/activity-delete-dialog.component';
import { ActivityUpdateComponent } from 'app/activity-type/activity-update/activity-update.component';
import { ActivityListComponent } from 'app/activity-type/activity-list/activity-list.component';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(activityTypeRoutes)],
  declarations: [
    ActivityTypeComponent,
    ActivityTypeUpdateComponent,
    ActivityListComponent,
    ActivityTypeDeleteDialogComponent,
    ActivityUpdateComponent,
    ActivityDeleteDialogComponent,
  ],
  entryComponents: [ActivityTypeDeleteDialogComponent, ActivityDeleteDialogComponent],
})
export class MaxmoveActivityTypeModule {}
