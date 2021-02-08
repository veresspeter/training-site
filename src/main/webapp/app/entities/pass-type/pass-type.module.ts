import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { PassTypeComponent } from './pass-type.component';
import { PassTypeDetailComponent } from './pass-type-detail.component';
import { PassTypeUpdateComponent } from './pass-type-update.component';
import { PassTypeDeleteDialogComponent } from './pass-type-delete-dialog.component';
import { passTypeRoute } from './pass-type.route';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(passTypeRoute)],
  declarations: [PassTypeComponent, PassTypeDetailComponent, PassTypeUpdateComponent, PassTypeDeleteDialogComponent],
  entryComponents: [PassTypeDeleteDialogComponent],
})
export class MaxmovePassTypeModule {}
