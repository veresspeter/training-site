import { NgModule } from '@angular/core';
import { ContactComponent } from './contact.component';
import { TrainingsiteSharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { contactRoutes } from 'app/contact/contact.routes';

@NgModule({
  imports: [TrainingsiteSharedModule, RouterModule.forChild(contactRoutes)],
  declarations: [ContactComponent],
})
export class ContactModule {}
