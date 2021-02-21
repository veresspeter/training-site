import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';

@Component({
  templateUrl: './activity-type-delete-dialog.component.html',
})
export class ActivityTypeDeleteDialogComponent {
  activityType?: IActivityType;

  constructor(
    protected activityTypeService: ActivityTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activityTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('activityTypeListModification');
      this.activeModal.close();
    });
  }
}
