import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerComponent } from './trainer.component';
import { RouterModule } from '@angular/router';
import { trainerRoutes } from 'app/trainer/trainer.route';

@NgModule({
  declarations: [TrainerComponent],
  imports: [CommonModule, RouterModule.forChild(trainerRoutes)],
})
export class TrainerModule {}