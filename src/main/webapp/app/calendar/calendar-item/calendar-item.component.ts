import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IEvent } from 'app/shared/model/event.model';
import { EventDeleteDialogComponent } from 'app/calendar/event-delete/event-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Moment } from 'moment';
import * as moment from 'moment';
import { IAppUser } from 'app/shared/model/application-user.model';
import { EventService } from 'app/shared/services/event.service';
import { JhiEventManager } from 'ng-jhipster';

@Component({
  selector: 'jhi-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.scss'],
})
export class CalendarItemComponent implements OnInit {
  @Input() event: IEvent | undefined;
  @Input() authorities: string[] | undefined = [];
  @Input() activeUserId: number | undefined;
  @Output() checkUserAuthentication = new EventEmitter<void>();

  saving = false;

  constructor(protected modalService: NgbModal, protected eventService: EventService, protected eventManager: JhiEventManager) {}

  ngOnInit(): void {}

  isAdmin(): boolean {
    return this.authorities?.find(auth => auth === 'ROLE_ADMIN') !== undefined;
  }

  delete(event: IEvent | undefined): void {
    if (event !== undefined) {
      const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.event = event;
    }
  }

  isJoinShown(event: IEvent | undefined): boolean {
    return this.isUserAuthenticated() && !this.isUserRegistered(event?.participants);
  }

  isRegisteredShown(event: IEvent | undefined): boolean {
    return this.isUserAuthenticated() && this.isUserRegistered(event?.participants);
  }

  isUserAuthenticated(): boolean {
    this.checkUserAuthentication.emit();
    return this.activeUserId !== undefined;
  }

  isUserRegistered(participants: IAppUser[] | undefined): boolean {
    return participants?.find(participant => participant.id === this.activeUserId) !== undefined;
  }

  isEventInProgress(event: IEvent | undefined): boolean {
    if (!event?.start || !event?.end) {
      return false;
    }

    const toStart = this.getMomentAndNowDiff(event.start);
    const toEnd = this.getMomentAndNowDiff(event.end);

    return toStart < 15 && toEnd > -15;
  }

  isEventEditable(event: IEvent | undefined): boolean {
    if (!event?.start || !event.end) {
      return false;
    }

    return this.getMomentAndNowDiff(event.start) < 120;
  }

  isEventClosed(event: IEvent | undefined): boolean {
    if (!event?.start || !event.end) {
      return false;
    }

    return this.getMomentAndNowDiff(event.start) < 120 && this.getMomentAndNowDiff(event.end) > -15;
  }

  isStartEnabled(event: IEvent): boolean {
    this.checkUserAuthentication.emit();
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

  getMomentAndNowDiff(time: Moment): number {
    return moment.duration(time.diff(moment())).asMinutes();
  }
}
