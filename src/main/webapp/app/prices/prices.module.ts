import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesComponent } from './prices.component';
import { RouterModule } from '@angular/router';
import { pricesRoutes } from 'app/prices/prices.route';
import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { PassTypeUpdateComponent } from 'app/prices/pass-type-update/pass-type-update.component';
import { PassTypeDeleteDialogComponent } from 'app/prices/pass-type-delete/pass-type-delete-dialog.component';
import { PassTypeConfirmDialogComponent } from 'app/prices/pass-type-confirm/pass-type-confirm-dialog.component';

@NgModule({
  declarations: [PricesComponent, PassTypeUpdateComponent, PassTypeDeleteDialogComponent, PassTypeConfirmDialogComponent],
  imports: [CommonModule, RouterModule.forChild(pricesRoutes), MaxmoveSharedModule],
  entryComponents: [PassTypeDeleteDialogComponent, PassTypeConfirmDialogComponent],
})
export class PricesModule {}
