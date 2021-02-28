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

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html',
  styleUrls: ['event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  events?: IEvent[];
  eventSubscriber?: Subscription;
  activeUserId: number | undefined;

  constructor(
    protected eventService: EventService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected accountService: AccountService
  ) {}

  loadAll(): void {
    this.eventService.query().subscribe((res: HttpResponse<IEvent[]>) => (this.events = res.body?.reverse() || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEvents();

    this.accountService.identity().subscribe(account => {
      this.activeUserId = account?.id;
    });
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
    return this.isUserAuthenticated() && !this.isEventClosed(event.start) && !this.isUserRegistered(event.participants);
  }

  isQuitEnabled(event: IEvent): boolean {
    return this.isUserAuthenticated() && !this.isEventClosed(event.start) && this.isUserRegistered(event.participants);
  }

  isUserAuthenticated(): boolean {
    if (this.activeUserId === undefined && this.accountService.isAuthenticated()) {
      this.accountService.identity().subscribe(account => {
        this.activeUserId = account?.id;
      });
    }
    return this.activeUserId !== undefined;
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
    return this.isUserAuthenticated() && this.isUserRegistered(event.participants) && toStart > -15 && toEnd < 15;
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
