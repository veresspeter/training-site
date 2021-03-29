import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEvent } from 'app/shared/model/event.model';
import { Moment } from 'moment';

@Component({
  selector: 'jhi-calendar-day-column',
  templateUrl: './calendar-day-column.component.html',
  styleUrls: ['./calendar-day-column.component.scss'],
})
export class CalendarDayColumnComponent implements OnInit {
  @Input() date: Date | undefined;
  @Input() events: IEvent[] | undefined;
  @Input() authorities: string[] | undefined = [];
  @Input() activeUserId: number | undefined;
  @Output() checkUserAuthentication = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  isDateToday(): boolean {
    return this.getDayByDate(this.date) === this.getDayByDate(new Date());
  }

  getDayByDate(date: Date | undefined): number {
    if (date === undefined) {
      return 0;
    }

    return Math.floor(date.getTime() / 1000 / 60 / 60 / 24 + 0.1);
  }

  getPositionByStart(start: Moment | undefined): number {
    if (start === undefined) {
      return 200;
    }

    if (start?.toDate()?.getHours() < 16) {
      return 0;
    }

    return ((start?.toDate()?.getHours() * 60 + start?.toDate()?.getMinutes() - 16 * 60) / 10) * 18 + 110;
  }

  isPastEvent(end: Moment | undefined): boolean {
    if (!end?.toDate()) {
      return false;
    }

    return end.toDate().getTime() < new Date().getTime();
  }

  emitAuthEvent(): void {
    this.checkUserAuthentication.emit();
  }
}
