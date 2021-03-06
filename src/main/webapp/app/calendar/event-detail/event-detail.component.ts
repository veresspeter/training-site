import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from 'app/shared/model/event.model';
import { AccountService } from 'app/core/auth/account.service';
import { LinkType } from 'app/shared/model/enumerations/link-type.model';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { AppUser, IAppUser } from 'app/shared/model/application-user.model';
import { SettingsComponent } from 'app/account/settings/settings.component';
import { Authority } from 'app/shared/constants/authority.constants';
import { FormBuilder } from '@angular/forms';
import { JhiEventManager } from 'ng-jhipster';

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  currentUser: AppUser | null = null;

  agora: AgoraConfig = {
    client: AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8',
    }),
    options: {
      appId: '44a98ea971f84d67aae6c23a87a9af5c',
      channel: 'test-channel',
      token: null,
      agoraCert: '947e84ec27094d5ab5ff7a8487538023',
    },
  };

  audioDevices: MediaDeviceInfo[] = [];
  videoDevices: MediaDeviceInfo[] = [];

  timeStamp = Math.floor(Number(new Date()) / 1000);
  localUID: string | undefined;
  pinnedUID: string | undefined;

  editForm = this.fb.group({
    audioSource: [],
    videoSource: [],
    musicSource: [],
  });

  event: IEvent | null = null;
  inMeeting = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected accountService: AccountService,
    protected eventManager: JhiEventManager
  ) {}

  private static getUserIdFromUID(uid: number | string): string {
    return uid.toString().substring(0, uid.toString().length - 4);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
    });
    this.authenticate();
    this.subscribeFromEvents();
    AgoraRTC.getDevices().then((devices: MediaDeviceInfo[]) => {
      this.audioDevices = devices.filter(device => device.kind === 'audioinput');
      this.videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (this.videoDevices.length > 0) {
        this.editForm.get('videoSource')?.setValue(this.videoDevices[0].deviceId);
      }

      if (this.audioDevices.length > 0) {
        this.editForm.get('audioSource')?.setValue(this.audioDevices[0].deviceId);
      }
    });
    const tS = this.timeStamp.toString().substring(6);
    this.localUID = this.currentUser?.id ? this.currentUser.id + tS : tS;
  }

  private subscribeFromEvents(): void {
    this.createLocaleMicrophoneTrack();
    this.createLocaleVideoTrack();
  }

  private createLocaleVideoTrack(): void {
    this.editForm.get('videoSource')?.valueChanges.subscribe(value => {
      AgoraRTC.createCameraVideoTrack({
        encoderConfig: '720p_2',
        optimizationMode: 'motion',
        cameraId: value,
      })
        .then(res => {
          if (this.agora.localVideoTrack) {
            if (this.inMeeting) {
              this.agora.client.unpublish(this.agora.localVideoTrack);
              this.agora.localVideoTrack?.close();
            }
            this.removeVideo(this.agora.localVideoTrack.getTrackId());
          }

          this.agora.localVideoTrack = res;
          this.agora.localVideoTrack.play('myVideoContainer');
          this.addVideoTrack(this.agora.localVideoTrack.getTrackId(), '??n');
          if (this.agora.localAudioTrack && this.localUID && !document.getElementById('mute_' + this.localUID)) {
            this.addAudioTrack(this.agora.localVideoTrack.getTrackId(), this.localUID);
          }

          if (this.inMeeting) {
            setTimeout(() => {
              if (this.agora.localVideoTrack) this.agora.client.publish(this.agora.localVideoTrack);
            }, 1000);
          }
        })
        .catch(err => {
          this.handleFail(err);
        });
    });
  }

  private createLocaleMicrophoneTrack(): void {
    this.editForm.get('audioSource')?.valueChanges.subscribe(value => {
      if (this.localUID && !this.agora.localVideoTrack && this.agora.localAudioTrack) {
        this.removeVideo(this.agora.localAudioTrack.getTrackId());
        if (this.inMeeting) {
          this.agora.client.unpublish(this.agora.localAudioTrack).then();
          this.agora.localAudioTrack.stop();
        }
      }
      AgoraRTC.createMicrophoneAudioTrack({
        /*
        // auto echo
        AEC: true,
        // auto gain
        AGC: false,
        // auto noise
        ANS: true,
         */
        encoderConfig: 'high_quality',
        microphoneId: value,
      })
        .then(res => {
          this.agora.localAudioTrack = res;
          if (this.localUID && this.agora.localVideoTrack) this.addAudioTrack(this.agora.localVideoTrack.getTrackId(), this.localUID);
          if (this.localUID && !this.agora.localVideoTrack) {
            this.setUpBlankVideo(this.agora.localAudioTrack.getTrackId(), this.localUID, true);
          }
          if (this.inMeeting) {
            setTimeout(() => {
              if (this.agora.localAudioTrack) this.agora.client.publish(this.agora.localAudioTrack);
            }, 5000);
          }
        })
        .catch(err => {
          this.handleFail(err);
        });
    });
  }

  ngOnDestroy(): void {
    this.leaveChannel();
    this.agora.localVideoTrack?.close();
    this.agora.localAudioTrack?.close();
  }

  leaveChannel(): void {
    this.agora.client.remoteUsers.forEach(user => {
      this.removeVideo(EventDetailComponent.getUserIdFromUID(user.uid));
    });

    this.agora.client.leave().then(() => (this.inMeeting = false));
  }

  join(): void {
    this.inMeeting = true;
    this.joinChannel();
    this.subscribeAgoraEvents();
  }

  private subscribeAgoraEvents(): void {
    this.agora.client.on('user-published', (user, mediaType) => {
      this.agora.client.subscribe(user, mediaType).then(() => {
        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;

          if (remoteVideoTrack && EventDetailComponent.getUserIdFromUID(user.uid) === this.event?.organizer?.id?.toString()) {
            remoteVideoTrack.play('myVideoContainer');
            this.addVideoTrack(remoteVideoTrack.getTrackId(), this.event?.organizer?.internalUser?.firstName);
            // this.removeBlackVideo(user, remoteVideoTrack);
          } else {
            if (remoteVideoTrack) {
              remoteVideoTrack?.play('remoteVideoContainer');
              if (this.currentUser?.internalUser?.authorities?.find(auth => auth === Authority.ADMIN || auth === Authority.EDITOR)) {
                const name = this.event?.participants?.find(p => p.id?.toString() === EventDetailComponent.getUserIdFromUID(user.uid))
                  ?.internalUser?.firstName;
                this.addVideoTrack(remoteVideoTrack.getTrackId(), name, true);
                // this.removeBlackVideo(user, remoteVideoTrack);
              }
            }
          }
        }

        if (mediaType === 'audio') {
          setTimeout(() => {
            if (
              this.currentUser?.internalUser?.authorities?.find(auth => auth === Authority.ADMIN || auth === Authority.EDITOR) ||
              EventDetailComponent.getUserIdFromUID(user.uid) === this.event?.organizer?.id?.toString()
            ) {
              const videoTrack = this.agora.client.remoteUsers.find(rUser => rUser.uid === user.uid && rUser.videoTrack !== undefined)
                ?.videoTrack;

              if (
                videoTrack === undefined &&
                user.audioTrack?.getTrackId() &&
                document.getElementById('agora-video-player-' + user.audioTrack?.getTrackId()) === null
              ) {
                this.setUpBlankVideo(user.audioTrack?.getTrackId(), user.uid.toString());
              } else {
                if (user.audioTrack && videoTrack) {
                  this.addAudioTrack(videoTrack.getTrackId(), user.uid.toString());

                  const muteButton = document.getElementById('mute_' + user.uid.toString())!;
                  muteButton.removeAttribute('disabled');

                  if (!muteButton.classList.contains('muted')) {
                    muteButton.classList.remove('btn-primary');
                    muteButton.classList.add('btn-outline-primary');
                  }
                }
              }
            }
          }, 5000);

          user.audioTrack?.play();
        }
      });
    });

    this.agora.client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        this.removeVideo(EventDetailComponent.getUserIdFromUID(user.uid));
      }
      if (mediaType === 'audio') {
        const muteButton = document.getElementById('mute_' + user.uid)!;
        muteButton.setAttribute('disabled', '');
        muteButton.classList.add('btn-primary');
        muteButton.classList.remove('btn-outline-primary');
      }
    });
  }

  private setUpBlankVideo(audioTrackId: string, userId: string, local?: boolean): void {
    const blankDiv = document.createElement('div');
    blankDiv.id = 'agora-video-player-' + audioTrackId;
    const video = document.createElement('video');
    video.id = 'video_' + audioTrackId;
    blankDiv.appendChild(video);

    if (local) {
      document.getElementById('myVideoContainer')!.appendChild(blankDiv);
      this.addVideoTrack(audioTrackId, '??n', false);
    } else {
      const name = this.event?.participants?.find(p => p.id?.toString() === EventDetailComponent.getUserIdFromUID(userId))?.internalUser
        ?.firstName;
      document.getElementById('remoteVideoContainer')!.appendChild(blankDiv);
      this.addVideoTrack(audioTrackId, name, true);
    }

    this.addAudioTrack(audioTrackId, userId);
  }

  private removeBlackVideo(user: IAgoraRTCRemoteUser, remoteVideoTrack: IRemoteVideoTrack): void {
    const blankDiv = document.getElementById('agora-video-player-' + user.uid.toString());
    if (remoteVideoTrack && blankDiv) {
      blankDiv.parentNode?.removeChild(blankDiv);
      this.addAudioTrack(remoteVideoTrack.getTrackId(), user.uid.toString());
    }
  }

  private joinChannel(): void {
    /*
    if (this.event?.id && this.event.start) {
      this.agora.options.channel = this.event.id + this.event.start.format('yyyyyMMddHHmm');
    }
     */

    this.accountService.getAgoraToken(this.agora.options.channel, this.timeStamp.toString()).subscribe(
      res => {
        this.agora.options.token = res;
        this.joinAgoraChannel();
      },
      err => {
        this.handleFail(err);
        this.leaveChannel();
      }
    );
  }

  private joinAgoraChannel(): void {
    this.agora.client
      .join(this.agora.options.appId, this.agora.options.channel, this.agora.options.token, this.localUID)
      .then(() => {
        const publishOptions: ILocalTrack[] = [];

        if (this.audioDevices.length > 0 && this.agora.localAudioTrack) {
          publishOptions.push(this.agora.localAudioTrack);
        }

        if (this.videoDevices.length > 0 && this.agora.localVideoTrack) {
          publishOptions.push(this.agora.localVideoTrack);
        }

        if (publishOptions.length > 0) {
          this.agora.client.publish(publishOptions).catch(err => this.handleFail(err));
        }
      })
      .catch(err => {
        this.handleFail(err);
        this.leaveChannel();
      });
  }

  addVideoTrack(userId: string, name?: string, small?: boolean, skipRotate?: boolean): void {
    const streamDiv = document.getElementById('agora-video-player-' + userId);
    this.setPlayerStyle(streamDiv, small);

    const videoDiv = document.getElementById('video_' + userId);
    this.setVideoStyle(videoDiv, skipRotate);

    const nameP = document.createElement('p');
    nameP.innerText = name ? name : '';
    nameP.style.position = 'absolute';
    nameP.style.left = '0';
    nameP.style.bottom = '0';
    nameP.style.margin = '0';
    nameP.style.padding = '0 5px';
    nameP.style.color = '#e17f3d';
    nameP.style.backgroundColor = '#ecd0ab';
    nameP.style.opacity = '0.9';
    nameP.style.fontSize = '12px';
    streamDiv?.appendChild(nameP);

    if (
      this.localUID !== userId &&
      this.agora.localVideoTrack?.getTrackId().toString() !== userId &&
      this.agora.localAudioTrack?.getTrackId().toString() !== userId &&
      this.pinnedUID !== userId &&
      this.currentUser?.id !== this.event?.organizer?.id &&
      userId !== this.agora.localVideoTrack?.getTrackId()
    ) {
      const pinButton = this.showPinButton(userId);
      streamDiv?.appendChild(pinButton);
    }
  }

  addAudioTrack(videoTrackId: string, userId: string): void {
    const streamDiv = document.getElementById('agora-video-player-' + videoTrackId);
    const muteButton = this.createButton(5);
    muteButton.id = 'mute_' + userId;
    muteButton.classList.add('btn-outline-primary');
    muteButton.classList.remove('btn-primary');
    muteButton.innerHTML =
      '<fa-icon icon="microphone-slash" class="ng-fa-icon"><svg role="img" focusable="false" data-prefix="fas" data-icon="microphone-slash" class="svg-inline--fa fa-microphone-slash fa-w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M633.82 458.1l-157.8-121.96C488.61 312.13 496 285.01 496 256v-48c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v48c0 17.92-3.96 34.8-10.72 50.2l-26.55-20.52c3.1-9.4 5.28-19.22 5.28-29.67V96c0-53.02-42.98-96-96-96s-96 42.98-96 96v45.36L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.41-6.97 4.16-17.02-2.82-22.45zM400 464h-56v-33.77c11.66-1.6 22.85-4.54 33.67-8.31l-50.11-38.73c-6.71.4-13.41.87-20.35.2-55.85-5.45-98.74-48.63-111.18-101.85L144 241.31v6.85c0 89.64 63.97 169.55 152 181.69V464h-56c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16z"></path></svg></fa-icon>';

    muteButton.addEventListener('click', () => {
      this.switchMuteButton(userId);
    });
    streamDiv?.appendChild(muteButton);
  }

  private showPinButton(uid: string, unPinButton?: HTMLElement): HTMLElement {
    const pinButton = this.createButton(50);
    pinButton.classList.add('btn-outline-primary');
    pinButton.innerHTML =
      '<fa-icon icon="level-up-alt" class="ng-fa-icon"><svg role="img" focusable="false" data-prefix="fas" data-icon="level-up-alt" class="svg-inline--fa fa-level-up-alt fa-w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M313.553 119.669L209.587 7.666c-9.485-10.214-25.676-10.229-35.174 0L70.438 119.669C56.232 134.969 67.062 160 88.025 160H152v272H68.024a11.996 11.996 0 0 0-8.485 3.515l-56 56C-4.021 499.074 1.333 512 12.024 512H208c13.255 0 24-10.745 24-24V160h63.966c20.878 0 31.851-24.969 17.587-40.331z"></path></svg></fa-icon>';

    pinButton.addEventListener('click', () => {
      this.pinStream(uid);
      this.showUnPinButton(uid, pinButton);
    });

    if (unPinButton) {
      unPinButton?.parentNode?.appendChild(pinButton);
      unPinButton?.parentNode?.removeChild(unPinButton);
    }

    return pinButton;
  }

  private showUnPinButton(uid: string, pinButton?: HTMLElement): HTMLElement {
    const unPinButton = this.createButton(50);
    unPinButton.classList.add('btn-primary');
    unPinButton.innerHTML =
      '<fa-icon icon="level-down-alt" class="ng-fa-icon"><svg role="img" focusable="false" data-prefix="fas" data-icon="level-down-alt" class="svg-inline--fa fa-level-down-alt fa-w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M313.553 392.331L209.587 504.334c-9.485 10.214-25.676 10.229-35.174 0L70.438 392.331C56.232 377.031 67.062 352 88.025 352H152V80H68.024a11.996 11.996 0 0 1-8.485-3.515l-56-56C-4.021 12.926 1.333 0 12.024 0H208c13.255 0 24 10.745 24 24v328h63.966c20.878 0 31.851 24.969 17.587 40.331z"></path></svg></fa-icon>';

    unPinButton.addEventListener('click', () => {
      this.unPinStream(uid);
      this.showPinButton(uid, unPinButton);
    });

    if (pinButton) {
      pinButton?.parentNode?.appendChild(unPinButton);
      pinButton?.parentNode?.removeChild(pinButton);
    }

    return unPinButton;
  }

  pinStream(uid: string): void {
    if (this.pinnedUID) {
      const playerToUnPin = document.getElementById('agora-video-player-' + this.pinnedUID)!;
      playerToUnPin.style.width = '10vw';
      document.getElementById('remoteVideoContainer')?.appendChild(playerToUnPin);
    }

    this.pinnedUID = uid;
    const playerToPin = document.getElementById('agora-video-player-' + uid)!;
    playerToPin.style.width = '40vw';
    document.getElementById('myVideoContainer')?.appendChild(playerToPin);
  }

  unPinStream(uid: string): void {
    const playerToUnPin = document.getElementById('agora-video-player-' + uid)!;
    playerToUnPin.style.width = '10vw';
    document.getElementById('remoteVideoContainer')?.appendChild(playerToUnPin);
    this.pinnedUID = undefined;
  }

  switchMuteButton(uid: string): void {
    const muteButton = document.getElementById('mute_' + uid)!;
    if (muteButton?.classList.contains('muted')) {
      if (this.localUID === uid && this.agora.localAudioTrack) {
        this.agora.localAudioTrack.setVolume(100);
      } else {
        this.agora.client?.remoteUsers?.find(user => user.uid.toString() === uid)?.audioTrack?.play();
      }
      muteButton.classList.add('btn-outline-primary');
      muteButton.classList.remove('muted');
      muteButton.classList.remove('btn-primary');
    } else {
      if (this.agora.localAudioTrack && this.localUID === uid) {
        this.agora.localAudioTrack.setVolume(0);
      } else {
        this.agora.client?.remoteUsers?.find(user => user.uid.toString() === uid)?.audioTrack?.stop();
      }
      muteButton.classList.add('btn-primary');
      muteButton.classList.add('muted');
      muteButton.classList.remove('btn-outline-primary');
    }
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

      streamDiv.style.position = 'relative';
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
      videoDiv.style.backgroundColor = '#000';
    }
  }

  removeVideo(id: string): void {
    const remDiv = document.getElementById('agora-video-player-' + id);
    remDiv?.parentNode?.removeChild(remDiv);
  }

  handleFail(err: any): void {
    // eslint-disable-next-line no-console
    console.log(err);
    this.eventManager.broadcast({ name: 'trainingsiteApp.error', content: { message: err.toString() } });
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
    return linkType?.toString() === LinkType.ONLINE.toString();
  }

  getLinkTypeName(type: string | undefined): string {
    if (type) {
      return LinkType.parse(type).Name;
    } else {
      return '';
    }
  }

  isParticipantHaveProblem(user: IAppUser): boolean {
    return (
      (user.injury !== undefined && user.injury !== SettingsComponent.NONE) ||
      (user.surgery !== undefined && user.surgery !== SettingsComponent.NONE) ||
      (user.heartProblem !== undefined && user.heartProblem !== SettingsComponent.NONE) ||
      (user.respiratoryDisease !== undefined && user.respiratoryDisease !== SettingsComponent.NONE) ||
      (user.spineProblem !== undefined && user.spineProblem !== SettingsComponent.NONE) ||
      (user.regularPain !== undefined && user.regularPain !== SettingsComponent.NONE) ||
      (user.medicine !== undefined && user.medicine !== SettingsComponent.NONE) ||
      (user.otherProblem !== undefined && user.otherProblem !== SettingsComponent.NONE)
    );
  }
}

export interface AgoraConfig {
  client: IAgoraRTCClient;
  localAudioTrack?: IMicrophoneAudioTrack;
  localVideoTrack?: ICameraVideoTrack;
  options: AgoraOptions;
}

export interface AgoraOptions {
  appId: string;
  channel: string;
  token: string | null;
  agoraCert: string;
}
