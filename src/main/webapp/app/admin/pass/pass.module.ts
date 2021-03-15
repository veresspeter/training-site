import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { PassComponent } from './pass.component';
import { PassUpdateComponent } from './pass-update/pass-update.component';
import { PassDeleteDialogComponent } from './pass-delete/pass-delete-dialog.component';
import { passRoute } from './pass.route';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(passRoute)],
  declarations: [PassComponent, PassUpdateComponent, PassDeleteDialogComponent],
  entryComponents: [PassDeleteDialogComponent],
})
export class MaxmovePassModule {}
