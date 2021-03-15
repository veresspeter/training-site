import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { ApplicationUserComponent } from './application-user.component';
import { ApplicationUserUpdateComponent } from './update/application-user-update.component';
import { applicationUserRoute } from './application-user.route';
import { ApplicationUserDeleteDialogComponent } from 'app/admin/user-management/delete/application-user-delete-dialog.component';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(applicationUserRoute)],
  declarations: [ApplicationUserComponent, ApplicationUserUpdateComponent, ApplicationUserDeleteDialogComponent],
  entryComponents: [ApplicationUserDeleteDialogComponent],
})
export class MaxmoveApplicationUserModule {}
