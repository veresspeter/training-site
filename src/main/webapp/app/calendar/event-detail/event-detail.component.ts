import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from 'app/shared/model/event.model';
import { AccountService } from 'app/core/auth/account.service';
import { LinkType } from 'app/shared/model/enumerations/link-type.model';

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  event: IEvent | null = null;
  inMeeting = false;

  signature = '';
  signatureEndpoint = 'http://maxmove.hu';
  apiKey = 'DScn7swaQOKOGka9DZKYBg';
  secret = 'd7rh0zJXPZMcYqdhyGN0DeodLusHvFJNxxpi';
  role = '0';
  leaveUrl = 'calendar';
  userName = 'felhasználónév';
  email = '';
  roomNumber = '';
  password = '';

  constructor(protected activatedRoute: ActivatedRoute, protected accountService: AccountService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
    });
    this.authenticate();
  }

  previousState(): void {
    window.history.back();
  }

  authenticate(): void {
    this.accountService.identity().subscribe(account => {
      if (account != null) this.userName = account.internalUser?.lastName + ' ' + account.internalUser?.firstName;
    });
  }

  isEventOnline(linkType: LinkType | undefined): boolean {
    return linkType === LinkType.ONLINE;
  }
}
