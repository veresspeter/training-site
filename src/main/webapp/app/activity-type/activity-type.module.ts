import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { activityTypeRoutes } from './activity-type.route';
import { ActivityTypeComponent } from './activity-type.component';
import { ActivityTypeUpdateComponent } from 'app/activity-type/activity-type-update/activity-type-update.component';
import { ActivityTypeDeleteDialogComponent } from 'app/activity-type/activity-type-delete/activity-type-delete-dialog.component';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(activityTypeRoutes)],
  declarations: [ActivityTypeComponent, ActivityTypeUpdateComponent, ActivityTypeDeleteDialogComponent],
  entryComponents: [ActivityTypeDeleteDialogComponent],
})
export class MaxmoveActivityTypeModule {}
