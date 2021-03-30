import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from 'app/shared/model/event.model';
import { AccountService } from 'app/core/auth/account.service';
import { LinkType } from 'app/shared/model/enumerations/link-type.model';
import * as AgoraRTC from 'agora-rtc-sdk';
import { formatDate } from '@angular/common';
import { AppUser } from 'app/shared/model/application-user.model';
import { Stream } from 'agora-rtc-sdk';

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: IEvent | null = null;
  inMeeting = false;

  currentUser: AppUser | null = null;
  agoraClient = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });
  agoraCert = '354d6dee8aba46f9b5879132af8ccfb6';
  tempToken = '0069af1b91655eb47e2b0b82eb20a24f29fIAC0THZurINC22NZ2xs6ufUJ4Iw4nY+UKuYan66iTKBlcmLMzZAAAAAAEABfjXZElXlkYAEAAQCTeWRg';
  agoraID = '9af1b91655eb47e2b0b82eb20a24f29f';
  localStream: Stream | undefined;
  pinnedStream: Stream | undefined;

  constructor(protected activatedRoute: ActivatedRoute, protected accountService: AccountService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
    });
    this.authenticate();
  }

  ngOnDestroy(): void {
    this.leaveChannel();
  }

  leaveChannel(): void {
    this.agoraClient.leave();
    this.inMeeting = false;
  }

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
      const remoteUserIdString = this.getUserIdStringFromStreamId(remoteStream);

      if (this.event?.organizer?.id?.toString() === remoteUserIdString) {
        remoteStream.play('myVideoContainer');
        this.addVideoStream(remoteStream);
      } else {
        if (this.currentUser?.internalUser?.authorities?.find(auth => auth === 'ROLE_ADMIN')) {
          remoteStream.play('remoteVideoContainer');
          this.addVideoStream(remoteStream, true);
        }
      }
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

  private getUserIdStringFromStreamId(stream: Stream): string {
    return stream
      .getId()
      .toString()
      .substring(0, stream.getId().toString().length - 12);
  }

  private joinChannel(): void {
    this.agoraClient.join(
      this.tempToken,
      'test-channel',
      this.currentUser?.id + formatDate(new Date(), 'yyMMddhhmmss', 'hu-HU'),
      undefined,
      (uid: any) => {
        this.localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: true,
          video: true,
          mirror: false,
        });
        this.localStream.init(() => {
          if (this.localStream) {
            this.localStream.play('myVideoContainer');
            this.addVideoStream(this.localStream, false, true);
            this.agoraClient.publish(this.localStream, this.handleFail);
          }
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

  addVideoStream(stream: Stream, small?: boolean, skipRotate?: boolean): void {
    const streamDiv = document.getElementById('player_' + stream.getId());
    this.setPlayerStyle(streamDiv, small);

    const videoDiv = document.getElementById('video' + stream.getId());
    this.setVideoStyle(videoDiv, skipRotate);

    const muteButton = this.showMuteButton(stream);
    streamDiv?.appendChild(muteButton);

    if (
      this.localStream !== stream &&
      this.pinnedStream !== stream &&
      this.getUserIdStringFromStreamId(stream) !== this.event?.organizer?.id?.toString()
    ) {
      const pinButton = this.showPinButton(stream);

      streamDiv?.appendChild(pinButton);
    }
  }

  private showPinButton(stream: Stream, unPinButton?: HTMLElement): HTMLElement {
    const pinButton = this.createButton(50);
    pinButton.classList.add('btn-outline-primary');
    pinButton.innerHTML =
      '<fa-icon icon="level-up-alt" class="ng-fa-icon"><svg role="img" focusable="false" data-prefix="fas" data-icon="level-up-alt" class="svg-inline--fa fa-level-up-alt fa-w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M313.553 119.669L209.587 7.666c-9.485-10.214-25.676-10.229-35.174 0L70.438 119.669C56.232 134.969 67.062 160 88.025 160H152v272H68.024a11.996 11.996 0 0 0-8.485 3.515l-56 56C-4.021 499.074 1.333 512 12.024 512H208c13.255 0 24-10.745 24-24V160h63.966c20.878 0 31.851-24.969 17.587-40.331z"></path></svg></fa-icon>';

    pinButton.addEventListener('click', () => {
      this.pinStream(stream);
      this.showUnPinButton(stream, pinButton);
    });

    if (unPinButton) {
      unPinButton?.parentNode?.appendChild(pinButton);
      unPinButton?.parentNode?.removeChild(unPinButton);
    }

    return pinButton;
  }

  private showUnPinButton(stream: Stream, pinButton?: HTMLElement): HTMLElement {
    const unPinButton = this.createButton(50);
    unPinButton.classList.add('btn-primary');
    unPinButton.innerHTML =
      '<fa-icon icon="level-down-alt" class="ng-fa-icon"><svg role="img" focusable="false" data-prefix="fas" data-icon="level-down-alt" class="svg-inline--fa fa-level-down-alt fa-w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M313.553 392.331L209.587 504.334c-9.485 10.214-25.676 10.229-35.174 0L70.438 392.331C56.232 377.031 67.062 352 88.025 352H152V80H68.024a11.996 11.996 0 0 1-8.485-3.515l-56-56C-4.021 12.926 1.333 0 12.024 0H208c13.255 0 24 10.745 24 24v328h63.966c20.878 0 31.851 24.969 17.587 40.331z"></path></svg></fa-icon>';

    unPinButton.addEventListener('click', () => {
      this.unPinStream(stream);
      this.showPinButton(stream, unPinButton);
    });

    if (pinButton) {
      pinButton?.parentNode?.appendChild(unPinButton);
      pinButton?.parentNode?.removeChild(pinButton);
    }

    return unPinButton;
  }

  pinStream(stream: Stream): void {
    if (this.pinnedStream) {
      const playerToUnPin = document.getElementById('player_' + this.pinnedStream.getId().toString())!;
      playerToUnPin.style.width = '10vw';
      document.getElementById('remoteVideoContainer')?.appendChild(playerToUnPin);
    }

    this.pinnedStream = stream;
    const playerToPin = document.getElementById('player_' + stream.getId().toString())!;
    playerToPin.style.width = '40vw';
    document.getElementById('myVideoContainer')?.appendChild(playerToPin);
  }

  unPinStream(stream: Stream): void {
    const playerToUnPin = document.getElementById('player_' + stream.getId().toString())!;
    playerToUnPin.style.width = '10vw';
    document.getElementById('remoteVideoContainer')?.appendChild(playerToUnPin);
    this.pinnedStream = undefined;
  }

  showUnMuteButton(stream: Stream, muteButton?: HTMLElement): HTMLElement {
    const unmuteButton = this.createButton(5);
    unmuteButton.classList.add('btn-primary');
    unmuteButton.innerHTML =
      '<fa-icon icon="microphone" class="ng-fa-icon"><svg role="img" focusable="false" data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone fa-w-11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path></svg></fa-icon>';

    unmuteButton.addEventListener('click', () => {
      stream.unmuteAudio();
      this.showMuteButton(stream, unmuteButton);
    });

    if (muteButton) {
      muteButton?.parentNode?.appendChild(unmuteButton);
      muteButton?.parentNode?.removeChild(muteButton);
    }

    return unmuteButton;
  }

  showMuteButton(stream: Stream, unmuteButton?: HTMLElement): HTMLElement {
    const muteButton = this.createButton(5);
    muteButton.classList.add('btn-outline-primary');
    muteButton.innerHTML =
      '<fa-icon icon="microphone-slash" class="ng-fa-icon"><svg role="img" focusable="false" data-prefix="fas" data-icon="microphone-slash" class="svg-inline--fa fa-microphone-slash fa-w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M633.82 458.1l-157.8-121.96C488.61 312.13 496 285.01 496 256v-48c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v48c0 17.92-3.96 34.8-10.72 50.2l-26.55-20.52c3.1-9.4 5.28-19.22 5.28-29.67V96c0-53.02-42.98-96-96-96s-96 42.98-96 96v45.36L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.41-6.97 4.16-17.02-2.82-22.45zM400 464h-56v-33.77c11.66-1.6 22.85-4.54 33.67-8.31l-50.11-38.73c-6.71.4-13.41.87-20.35.2-55.85-5.45-98.74-48.63-111.18-101.85L144 241.31v6.85c0 89.64 63.97 169.55 152 181.69V464h-56c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16z"></path></svg></fa-icon>';

    muteButton.addEventListener('click', () => {
      stream.muteAudio();
      this.showUnMuteButton(stream, muteButton);
    });

    if (unmuteButton) {
      unmuteButton?.parentNode?.appendChild(muteButton);
      unmuteButton?.parentNode?.removeChild(unmuteButton);
    }

    return muteButton;
  }

  createButton(offset: number): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-icon');
    button.style.position = 'absolute';
    button.style.right = offset + 'px';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.padding = '6px 1px';
    return button;
  }

  private setPlayerStyle(streamDiv: HTMLElement | null, small?: boolean): void {
    if (streamDiv != null) {
      if (!small) {
        streamDiv.style.width = '40vw';
      } else {
        streamDiv.style.width = '10vw';
      }

      streamDiv.style.minWidth = '240px';
      streamDiv.style.height = 'auto';
      streamDiv.style.margin = '12px';
    }
  }

  private setVideoStyle(videoDiv: HTMLElement | null, skipRotate?: boolean): void {
    if (videoDiv != null) {
      if (!skipRotate) {
        videoDiv.style.transform = 'rotateY(180deg)';
      }

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
    this.leaveChannel();
    window.history.back();
  }

  authenticate(): void {
    this.accountService.identity().subscribe(account => {
      this.currentUser = account;
    });
  }

  isEventOnline(linkType: LinkType | undefined): boolean {
    return linkType === LinkType.ONLINE;
  }
}
