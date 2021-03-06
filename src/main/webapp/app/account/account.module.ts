import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrainingsiteSharedModule } from 'app/shared/shared.module';

import { SessionsComponent } from './sessions/sessions.component';
import { PasswordStrengthBarComponent } from './password/password-strength-bar.component';
import { RegisterComponent } from './register/register.component';
import { ActivateComponent } from './activate/activate.component';
import { PasswordComponent } from './password/password.component';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init.component';
import { PasswordResetFinishComponent } from './password-reset/finish/password-reset-finish.component';
import { SettingsComponent } from './settings/settings.component';
import { accountState } from './account.route';
import { MyEventsComponent } from './my-events/my-events.component';
import { MyPassesComponent } from './my-passes/my-passes.component';

@NgModule({
  imports: [TrainingsiteSharedModule, RouterModule.forChild(accountState)],
  declarations: [
    ActivateComponent,
    RegisterComponent,
    PasswordComponent,
    PasswordStrengthBarComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SessionsComponent,
    SettingsComponent,
    MyEventsComponent,
    MyPassesComponent,
  ],
})
export class AccountModule {}
