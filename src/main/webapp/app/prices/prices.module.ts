import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesComponent } from './prices.component';
import { RouterModule } from '@angular/router';
import { pricesRoutes } from 'app/prices/prices.route';
import { TrainingsiteSharedModule } from 'app/shared/shared.module';
import { PassTypeUpdateComponent } from 'app/prices/pass-type-update/pass-type-update.component';
import { PassTypeDeleteDialogComponent } from 'app/prices/pass-type-delete/pass-type-delete-dialog.component';
import { PassTypeConfirmDialogComponent } from 'app/prices/pass-type-confirm/pass-type-confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PricesComponent, PassTypeUpdateComponent, PassTypeDeleteDialogComponent, PassTypeConfirmDialogComponent],
  imports: [CommonModule, RouterModule.forChild(pricesRoutes), TrainingsiteSharedModule, MatButtonModule],
  entryComponents: [PassTypeDeleteDialogComponent, PassTypeConfirmDialogComponent],
})
export class PricesModule {}
