import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from 'app/shared/model/event.model';
import { AccountService } from 'app/core/auth/account.service';
import { LinkType } from 'app/shared/model/enumerations/link-type.model';
import * as AgoraRTC from 'agora-rtc-sdk';

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  @ViewChild('me') meVideoHolder: ElementRef;
  @ViewChild('remote') remoteVideoHolder: ElementRef;
  event: IEvent | null = null;
  inMeeting = false;

  userName = 'felhasználónév';
  agoraClient = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });
  agoraCert = '354d6dee8aba46f9b5879132af8ccfb6';
  tempToken = '0069af1b91655eb47e2b0b82eb20a24f29fIAC0THZurINC22NZ2xs6ufUJ4Iw4nY+UKuYan66iTKBlcmLMzZAAAAAAEABfjXZElXlkYAEAAQCTeWRg';
  agoraID = '9af1b91655eb47e2b0b82eb20a24f29f';
  localStream: any;

  constructor(protected activatedRoute: ActivatedRoute, protected accountService: AccountService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
    });
    this.authenticate();

    this.agoraClient.init(
      this.agoraID,
      () => {
        // eslint-disable-next-line no-console
        console.log('client initialized');
      },
      (err: any) => {
        // eslint-disable-next-line no-console
        console.log('client init failed ', err);
      }
    );

    this.agoraClient.join(
      this.tempToken,
      'test-channel',
      null,
      undefined,
      (uid: any) => {
        this.localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: true,
          video: true,
        });
        this.localStream.init(() => {
          this.localStream.play('me');
          this.agoraClient.publish(this.localStream, this.handleFail);
        }, this.handleFail);
      },
      this.handleFail
    );

    /*
    this.agoraClient.on('stream-added', (event: any) => {
      this.agoraClient.subscribe(event.stream,{}, this.handleFail);
    })

    this.agoraClient.on('stream-subscribed', (event: any) => {
      const remoteStream = event.stream;
      const streamId = String(remoteStream.getId());
      this.addVideoStream(streamId);
      remoteStream.play(streamId);
    })

    this.agoraClient.on('stream-removed', (event: any) => {
      const remoteStream = event.stream;
      const streamId = String(remoteStream.getId());
      remoteStream.close();
      this.removeVideoStream(streamId);
    });
    */
  }

  ngOnDestroy(): void {
    this.agoraClient.on('peer-live', (event: any) => {
      const remoteStream = event.stream;
      const streamId = String(remoteStream.getId());
      remoteStream.close();
      this.removeVideoStream(streamId);
    });
  }

  addVideoStream(id: string): void {
    const streamDiv = document.createElement('div');
    streamDiv.id = id;
    streamDiv.style.transform = 'rotateY(180deg)';
    this.remoteVideoHolder.nativeElement.appendChild(streamDiv);
  }

  removeVideoStream(id: string): void {
    const remDiv = document.getElementById(id);
    remDiv?.parentNode?.removeChild(remDiv);
  }

  handleFail(err: any): void {
    // eslint-disable-next-line no-console
    console.log(err);
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
