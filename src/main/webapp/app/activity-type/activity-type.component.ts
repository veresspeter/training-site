import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';
import { IActivityType } from 'app/shared/model/activity-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ActivityTypeDeleteDialogComponent } from 'app/activity-type/activity-type-delete/activity-type-delete-dialog.component';

@Component({
  selector: 'jhi-home',
  templateUrl: './activity-type.component.html',
  styleUrls: ['activity-type.component.scss'],
})
export class ActivityTypeComponent implements OnInit, OnDestroy {
  activityTypes?: IActivityType[] = [];
  eventSubscriber?: Subscription;
  loading = true;

  constructor(
    protected activityTypeService: ActivityTypeService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected router: Router
  ) {}

  loadAll(): void {
    this.activityTypeService.query().subscribe((res: HttpResponse<IActivityType[]>) => {
      this.activityTypes = res.body || [];
      this.loading = false;
    });
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
