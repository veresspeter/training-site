import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IEvent } from 'app/shared/model/event.model';
import { EventService } from '../shared/services/event.service';
import { AccountService } from 'app/core/auth/account.service';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html',
  styleUrls: ['event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  readonly DAY_TO_MS = 24 * 60 * 60 * 1000;
  readonly SINGLE_DAY_CALENDAR_MAX_WIDTH = 425;

  authorities: string[] | undefined = [];
  events?: IEvent[];
  eventSubscriber?: Subscription;
  activeUserId: number | undefined;
  isUserRequestActive = false;
  loading = true;
  datePickerFirstDate: Date;
  datePickerLastDate: Date;

  constructor(
    protected eventService: EventService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService,
    protected applicationUserService: ApplicationUserService,
    protected userService: UserService
  ) {
    const date = new Date();
    if (date.getDay() !== 1) {
      this.datePickerFirstDate = new Date((this.getDayByDate(date) - ((date.getDay() + 6) % 7)) * this.DAY_TO_MS);
    } else {
      this.datePickerFirstDate = new Date(this.getDayByDate(date) * this.DAY_TO_MS);
    }
    this.datePickerLastDate = new Date(this.datePickerFirstDate.getTime() + 6 * this.DAY_TO_MS);
  }

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

  checkUserAuthentication(): void {
    if (this.activeUserId === undefined && this.accountService.isAuthenticated() && !this.isUserRequestActive) {
      this.isUserRequestActive = true;
      this.accountService.identity().subscribe(
        account => {
          if (account !== null && account.internalUser!.id !== null) {
            this.applicationUserService.findByInternalId(account.internalUser!.id).subscribe(
              res => {
                this.authorities = res.body?.internalUser?.authorities;
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

  getCalendarDates(): Date[] {
    if (!this.isMultiDate()) {
      return [new Date()];
    } else {
      const dates: Date[] = [];
      for (let i = 0; i < 7; i++) {
        dates.push(new Date((this.getDayByDate(this.datePickerFirstDate) + i) * this.DAY_TO_MS));
      }
      return dates;
    }
  }

  isMultiDate(): boolean {
    return window.innerWidth > this.SINGLE_DAY_CALENDAR_MAX_WIDTH;
  }

  decreaseDatePicker(): void {
    this.datePickerLastDate = new Date((this.getDayByDate(this.datePickerLastDate) - 7) * this.DAY_TO_MS);
    this.datePickerFirstDate = new Date((this.getDayByDate(this.datePickerFirstDate) - 7) * this.DAY_TO_MS);
  }

  increaseDatePicker(): void {
    this.datePickerLastDate = new Date((this.getDayByDate(this.datePickerLastDate) + 7) * this.DAY_TO_MS);
    this.datePickerFirstDate = new Date((this.getDayByDate(this.datePickerFirstDate) + 7) * this.DAY_TO_MS);
  }

  getEventsByDay(date: Date): IEvent[] | undefined {
    return this.events?.filter((event: IEvent) => this.getDayByDate(event?.start?.toDate()) === this.getDayByDate(date));
  }

  getDayByDate(date: Date | undefined): number {
    if (date === undefined) {
      return 0;
    }

    return Math.floor(date.getTime() / this.DAY_TO_MS + 0.1);
  }

  isLeftDatePickerDisabled(): boolean {
    return this.getDayByDate(this.datePickerLastDate) < this.getDayByDate(new Date());
  }

  emitAuthEvent(): void {
    this.checkUserAuthentication();
  }
}
