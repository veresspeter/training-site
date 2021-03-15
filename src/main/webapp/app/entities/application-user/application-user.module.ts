import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { ApplicationUserComponent } from './application-user.component';
import { ApplicationUserDetailComponent } from './detail/application-user-detail.component';
import { ApplicationUserUpdateComponent } from './update/application-user-update.component';
import { applicationUserRoute } from './application-user.route';
import { ApplicationUserDeleteDialogComponent } from 'app/entities/application-user/delete/application-user-delete-dialog.component';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(applicationUserRoute)],
  declarations: [
    ApplicationUserComponent,
    ApplicationUserDetailComponent,
    ApplicationUserUpdateComponent,
    ApplicationUserDeleteDialogComponent,
  ],
  entryComponents: [ApplicationUserDeleteDialogComponent],
})
export class MaxmoveApplicationUserModule {}
