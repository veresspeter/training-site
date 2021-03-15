import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEvent } from 'app/shared/model/event.model';
import { EventService } from '../shared/services/event.service';
import { EventDeleteDialogComponent } from './event-delete/event-delete-dialog.component';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AccountService } from 'app/core/auth/account.service';
import { IAppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html',
  styleUrls: ['event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  events?: IEvent[];
  eventSubscriber?: Subscription;
  activeUserId: number | undefined;
  isUserRequestActive = false;
  loading = true;
  saving = false;

  constructor(
    protected eventService: EventService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected applicationUserService: ApplicationUserService
  ) {}

  loadAll(): void {
    this.eventService.query().subscribe((res: HttpResponse<IEvent[]>) => {
      this.events = res.body?.reverse() || [];
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEvents();
    this.checkUserAuthentication();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEvent): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEvents(): void {
    this.eventSubscriber = this.eventManager.subscribe('eventListModification', () => this.loadAll());
  }

  delete(event: IEvent): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
  }

  isJoinShown(event: IEvent): boolean {
    return this.isUserAuthenticated() && !this.isUserRegistered(event.participants);
  }

  isRegisteredShown(event: IEvent): boolean {
    return this.isUserAuthenticated() && this.isUserRegistered(event.participants);
  }

  isUserRegistered(participants: IAppUser[] | undefined): boolean {
    return participants?.find(participant => participant.id === this.activeUserId) !== undefined;
  }

  isUserAuthenticated(): boolean {
    this.checkUserAuthentication();
    return this.activeUserId !== undefined;
  }

  isEventInProgress(event: IEvent): boolean {
    if (!event.start || !event.end) {
      return false;
    }

    const toStart = this.getMomentAndNowDiff(event.start);
    const toEnd = this.getMomentAndNowDiff(event.end);

    return toStart < 15 && toEnd > -15;
  }

  isEventEditable(event: IEvent): boolean {
    if (!event.start || !event.end) {
      return false;
    }

    return this.getMomentAndNowDiff(event.start) < 180;
  }

  isEventClosed(event: IEvent): boolean {
    if (!event.start || !event.end) {
      return false;
    }

    return this.getMomentAndNowDiff(event.start) < 180 && this.getMomentAndNowDiff(event.end) > -15;
  }

  isStartEnabled(event: IEvent): boolean {
    this.checkUserAuthentication();
    return this.isEventInProgress(event) && this.isUserRegistered(event.participants) && this.activeUserId !== undefined;
  }

  joinEvent(eventId: number | undefined): void {
    this.saving = true;
    if (eventId !== undefined) {
      this.eventService.join(eventId).subscribe(
        () => {
          this.saving = false;
          this.eventManager.broadcast('eventListModification');
        },
        () => (this.saving = false)
      );
    }
  }

  quitEvent(eventId: number | undefined): void {
    this.saving = true;
    if (eventId !== undefined) {
      this.eventService.quit(eventId).subscribe(
        () => {
          this.saving = false;
          this.eventManager.broadcast('eventListModification');
        },
        () => (this.saving = false)
      );
    }
  }

  checkUserAuthentication(): void {
    if (this.activeUserId === undefined && this.accountService.isAuthenticated() && !this.isUserRequestActive) {
      this.isUserRequestActive = true;
      this.accountService.identity().subscribe(
        account => {
          if (account !== null && account.id !== null) {
            this.applicationUserService.findByInternalId(account.id).subscribe(
              res => {
                this.activeUserId = res.body?.id;
                this.isUserRequestActive = false;
              },
              () => (this.isUserRequestActive = false)
            );
          }
        },
        () => (this.isUserRequestActive = false)
      );
    }
  }

  getMomentAndNowDiff(time: Moment): number {
    return moment.duration(time.diff(moment())).asMinutes();
  }
}
