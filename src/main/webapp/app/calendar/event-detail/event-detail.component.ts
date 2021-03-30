import { Component, OnDestroy, OnInit } from '@angular/core';
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
  event: IEvent | null = null;
  inMeeting = false;

  userName = 0;
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
  }

  ngOnDestroy(): void {}

  join(): void {
    this.inMeeting = true;
    this.initAgora();
    this.joinChannel();
    this.subscribeAgoraEvents();
  }

  private subscribeAgoraEvents(): void {
    this.agoraClient.on('stream-added', (event: any) => {
      this.agoraClient.subscribe(event.stream, {}, this.handleFail);
    });

    this.agoraClient.on('stream-subscribed', (event: any) => {
      const remoteStream = event.stream;

      if (this.event?.organizer?.id?.toString() === remoteStream.getId().toString()) {
        remoteStream.play('myVideoContainer');
      } else {
        remoteStream.play('remoteVideoContainer');
      }

      this.addVideoStream(remoteStream.getId());
    });

    this.agoraClient.on('stream-removed', (event: any) => {
      const remoteStream = event.stream;
      const streamId = String(remoteStream.getId());
      remoteStream.close();
      this.removeVideoStream(streamId);
    });

    this.agoraClient.on('peer-leave', (event: any) => {
      const remoteStream = event.stream;
      const streamId = String(remoteStream.getId());
      remoteStream.close();
      this.removeVideoStream(streamId);
    });
  }

  private joinChannel(): void {
    this.agoraClient.join(
      this.tempToken,
      'test-channel',
      this.userName,
      undefined,
      (uid: any) => {
        this.localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: true,
          video: true,
        });
        this.localStream.init(() => {
          this.localStream.play('myVideoContainer');
          this.agoraClient.publish(this.localStream, this.handleFail);
        }, this.handleFail);
      },
      this.handleFail
    );
  }

  private initAgora(): void {
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
  }

  addVideoStream(id: string): void {
    const streamDiv = document.getElementById('player_' + id);
    if (streamDiv != null) {
      streamDiv.style.transform = 'rotateY(180deg)';
      streamDiv.style.width = 'auto';
      streamDiv.style.height = 'auto';
    }

    const videoDiv = document.getElementById('video' + id);
    if (videoDiv != null) {
      videoDiv.style.width = '100%';
      videoDiv.style.height = '100%';
      videoDiv.style.position = 'relative';
    }
  }

  removeVideoStream(id: string): void {
    const remDiv = document.getElementById('player_' + id);
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
      if (account?.id != null) this.userName = account.id;
    });
  }

  isEventOnline(linkType: LinkType | undefined): boolean {
    return linkType === LinkType.ONLINE;
  }
}
