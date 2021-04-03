import { NgModule } from '@angular/core';
import { ContactComponent } from './contact.component';
import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { contactRoutes } from 'app/contact/contact.routes';

@NgModule({
  imports: [MaxmoveSharedModule, RouterModule.forChild(contactRoutes)],
  declarations: [ContactComponent],
})
export class ContactModule {}
