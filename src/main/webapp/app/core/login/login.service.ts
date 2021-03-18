import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider, LOGOUT_URL } from 'app/core/auth/auth-session.service';
import { Login } from './login.model';
import { AppUser } from 'app/shared/model/application-user.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider) {}

  login(credentials: Login): Observable<AppUser | null> {
    return this.authServerProvider.login(credentials).pipe(flatMap(() => this.accountService.identity(true)));
  }

  logoutUrl(): string {
    return LOGOUT_URL;
  }

  logoutInClient(): void {
    this.accountService.authenticate(null);
  }

  logout(): void {
    this.authServerProvider.logout().subscribe(null, null, () => this.accountService.authenticate(null));
  }
}
