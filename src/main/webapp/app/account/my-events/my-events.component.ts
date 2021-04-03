import { Component, OnInit } from '@angular/core';
import { IEvent } from 'app/shared/model/event.model';

@Component({
  selector: 'jhi-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
})
export class MyEventsComponent implements OnInit {
  loading = true;
  events?: IEvent[];

  constructor() {}

  ngOnInit(): void {}
}
