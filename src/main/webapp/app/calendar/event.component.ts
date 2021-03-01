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
import { IApplicationUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/application-user.service';

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

  constructor(
    protected eventService: EventService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected applicationUserService: ApplicationUserService
  ) {}

  loadAll(): void {
    this.eventService.query().subscribe((res: HttpResponse<IEvent[]>) => (this.events = res.body?.reverse() || []));
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

  isJoinEnabled(event: IEvent): boolean {
    this.checkUserAuthentication();
    return !this.isEventClosed(event.start) && !this.isUserRegistered(event.participants) && this.activeUserId !== undefined;
  }

  isQuitEnabled(event: IEvent): boolean {
    this.checkUserAuthentication();
    return !this.isEventClosed(event.start) && this.isUserRegistered(event.participants) && this.activeUserId !== undefined;
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

  isUserRegistered(participants: IApplicationUser[] | undefined): boolean {
    return participants?.find(participant => participant.id === this.activeUserId) !== undefined;
  }

  isEventClosed(start: Moment | undefined): boolean {
    return moment.duration(moment().diff(start)).asHours() > -3;
  }

  isStartEnabled(event: IEvent): boolean {
    const toStart = moment.duration(moment().diff(event?.start)).asMinutes();
    const toEnd = moment.duration(moment().diff(event?.end)).asMinutes();
    this.checkUserAuthentication();
    return this.isUserRegistered(event.participants) && toStart > -15 && toEnd < 15 && this.activeUserId !== undefined;
  }

  joinEvent(eventId: number | undefined): void {
    if (eventId !== undefined) {
      this.eventService.join(eventId).subscribe(() => {
        this.eventManager.broadcast('eventListModification');
      });
    }
  }

  quitEvent(eventId: number | undefined): void {
    if (eventId !== undefined) {
      this.eventService.quit(eventId).subscribe(() => {
        this.eventManager.broadcast('eventListModification');
      });
    }
  }
}
