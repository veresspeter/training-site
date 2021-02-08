import { Component, OnInit } from '@angular/core';

import { ActivityService } from 'app/entities/activity/activity.service';
import { Activity } from 'app/shared/model/activity.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  activities: Activity[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.query().subscribe(res => {
      if (res.body) {
        this.activities = res.body;
      }
    });
  }
}
