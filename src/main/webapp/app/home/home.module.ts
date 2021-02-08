import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { homeRoutes } from './home.route';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(homeRoutes)],
  declarations: [HomeComponent],
})
export class MaxmoveHomeModule {}
