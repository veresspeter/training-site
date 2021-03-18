import { Component, OnInit } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';
import { Session } from './session.model';
import { SessionsService } from './sessions.service';
import { AppUser } from 'app/shared/model/application-user.model';

@Component({
  selector: 'jhi-sessions',
  templateUrl: './sessions.component.html',
})
export class SessionsComponent implements OnInit {
  account: AppUser | null = null;
  error = false;
  success = false;
  sessions: Session[] = [];

  constructor(private sessionsService: SessionsService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.sessionsService.findAll().subscribe(sessions => (this.sessions = sessions));

    this.accountService.identity().subscribe(account => (this.account = account));
  }

  invalidate(series: string): void {
    this.error = false;
    this.success = false;

    this.sessionsService.delete(encodeURIComponent(series)).subscribe(
      () => {
        this.success = true;
        this.sessionsService.findAll().subscribe(sessions => (this.sessions = sessions));
      },
      () => (this.error = true)
    );
  }
}
