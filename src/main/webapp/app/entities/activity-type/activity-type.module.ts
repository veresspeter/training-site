import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { ActivityTypeComponent } from './activity-type.component';
import { ActivityTypeDetailComponent } from './activity-type-detail.component';
import { ActivityTypeUpdateComponent } from './activity-type-update.component';
import { ActivityTypeDeleteDialogComponent } from './activity-type-delete-dialog.component';
import { activityTypeRoute } from './activity-type.route';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(activityTypeRoute)],
  declarations: [ActivityTypeComponent, ActivityTypeDetailComponent, ActivityTypeUpdateComponent, ActivityTypeDeleteDialogComponent],
  entryComponents: [ActivityTypeDeleteDialogComponent],
})
export class MaxmoveActivityTypeModule {}
