import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZoomMtg } from '@zoomus/websdk';

import { IEvent } from 'app/shared/model/event.model';
import { AccountService } from 'app/core/auth/account.service';

ZoomMtg.i18n.load('en-US');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  zoomMtg = document.getElementById('zmmtg-root');

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

  ngOnDestroy(): void {
    if (this.zoomMtg != null) {
      this.zoomMtg.style.display = 'none';
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
      this.initializeCall();
    });
    this.authenticate();
  }

  initializeCall(): void {
    if (this.event === null || this.event.zoomRoomNo === undefined) {
      return;
    }

    this.signature = ZoomMtg.generateSignature({
      meetingNumber: this.event.zoomRoomNo,
      apiKey: this.apiKey,
      apiSecret: this.secret,
      role: this.role,
    });

    if (this.zoomMtg != null) {
      this.zoomMtg.style.display = 'block';
    }
  }

  joinMeeting(): void {
    this.inMeeting = true;

    if (this.event === null || this.event.zoomRoomNo === undefined || this.event.zoomRoomPsw === undefined) {
      this.inMeeting = false;
      return;
    }
    this.roomNumber = this.event.zoomRoomNo;
    this.password = this.event.zoomRoomPsw;

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          signature: this.signature,
          meetingNumber: this.roomNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.email,
          passWord: this.password,
          success(): void {},
          error(): void {},
        });
      },
      error(): void {},
    });
  }

  previousState(): void {
    window.history.back();
  }

  authenticate(): void {
    this.accountService.identity().subscribe(account => {
      if (account != null) this.userName = account?.lastName + ' ' + account?.lastName;
    });
  }
}
