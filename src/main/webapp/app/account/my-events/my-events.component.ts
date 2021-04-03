import { Component, OnInit } from '@angular/core';
import { IEvent } from 'app/shared/model/event.model';
import { AccountService } from 'app/core/auth/account.service';
import { Moment } from 'moment/moment';
import * as moment from 'moment/moment';

@Component({
  selector: 'jhi-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
})
export class MyEventsComponent implements OnInit {
  loading = true;
  events?: IEvent[];

  constructor(protected accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getMyEvents().subscribe(res => {
      this.events = res;
      this.loading = false;
    });
  }

  getDates(): Moment[] {
    const result: Moment[] = [];

    this.events?.forEach(event => {
      const eventDate = event.start;
      if (
        result.find(resultDate => moment(resultDate).format('YYYYMMDD') === moment(eventDate).format('YYYYMMDD')) === undefined &&
        eventDate
      ) {
        result.push(eventDate);
      }
    });

    result.sort((a, b) => Number(moment(a).format('YYYYMMDD')) - Number(moment(b).format('YYYYMMDD')));
    return result;
  }

  getEventsByDate(eventDate: Moment): IEvent[] {
    const result = this.events?.filter(event => moment(event.start).format('YYYYMMDD') === moment(eventDate).format('YYYYMMDD'));

    if (result) {
      result.sort((a, b) => Number(moment(a.start).format('YYYYMMDD')) - Number(moment(b.start).format('YYYYMMDD')));
      return result;
    } else {
      return [];
    }
  }
}
