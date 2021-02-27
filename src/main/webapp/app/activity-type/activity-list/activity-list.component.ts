import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivity } from 'app/shared/model/activity.model';
import { ActivityService } from 'app/shared/services/activity.service';
import { ActivityDeleteDialogComponent } from '../activity-delete/activity-delete-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { IActivityType } from 'app/shared/model/activity-type.model';

@Component({
  selector: 'jhi-activity',
  templateUrl: './activity-list.component.html',
  styleUrls: ['activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit, OnDestroy {
  activities?: IActivity[];
  eventSubscriber?: Subscription;
  activityType?: IActivityType;

  constructor(
    protected activityService: ActivityService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.activityService
      .query({ activityTypeId: this.activityType?.id })
      .subscribe((res: HttpResponse<IActivity[]>) => (this.activities = res.body || []));
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityType }) => {
      this.activityType = activityType;
      this.loadAll();
    });
    this.registerChangeInActivities();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IActivity): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInActivities(): void {
    this.eventSubscriber = this.eventManager.subscribe('activityListModification', () => this.loadAll());
  }

  delete(activity: IActivity): void {
    const modalRef = this.modalService.open(ActivityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.activity = activity;
  }
}
