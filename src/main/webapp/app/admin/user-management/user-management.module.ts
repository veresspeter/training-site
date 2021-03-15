import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementDetailComponent } from './detail/user-management-detail.component';
import { UserManagementUpdateComponent } from './update/user-management-update.component';
import { UserManagementDeleteDialogComponent } from './delete/user-management-delete-dialog.component';
import { userManagementRoute } from './user-management.route';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(userManagementRoute)],
  declarations: [
    UserManagementComponent,
    UserManagementDetailComponent,
    UserManagementUpdateComponent,
    UserManagementDeleteDialogComponent,
  ],
  entryComponents: [UserManagementDeleteDialogComponent],
})
export class UserManagementModule {}
