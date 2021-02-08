import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesComponent } from './prices.component';
import { RouterModule } from '@angular/router';
import { pricesRoutes } from 'app/prices/prices.route';

@NgModule({
  declarations: [PricesComponent],
  imports: [CommonModule, RouterModule.forChild(pricesRoutes)],
})
export class PricesModule {}
