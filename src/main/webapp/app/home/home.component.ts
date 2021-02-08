import { Component, OnInit } from '@angular/core';

import { Activity } from 'app/shared/model/activity.model';
import { ActivityTypeService } from 'app/entities/activity-type/activity-type.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  activityTypes: Activity[] = [];

  constructor(private activityTypeService: ActivityTypeService) {}

  ngOnInit(): void {
    this.activityTypeService.query().subscribe(res => {
      if (res.body) {
        this.activityTypes = res.body;
      }
    });
  }
}
