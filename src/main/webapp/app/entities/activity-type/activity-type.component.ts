import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeService } from './activity-type.service';
import { ActivityTypeDeleteDialogComponent } from './activity-type-delete-dialog.component';

@Component({
  selector: 'jhi-activity-type',
  templateUrl: './activity-type.component.html',
})
export class ActivityTypeComponent implements OnInit, OnDestroy {
  activityTypes?: IActivityType[];
  eventSubscriber?: Subscription;

  constructor(
    protected activityTypeService: ActivityTypeService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.activityTypeService.query().subscribe((res: HttpResponse<IActivityType[]>) => (this.activityTypes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInActivityTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IActivityType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInActivityTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('activityTypeListModification', () => this.loadAll());
  }

  delete(activityType: IActivityType): void {
    const modalRef = this.modalService.open(ActivityTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.activityType = activityType;
  }
}
