import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';

@Component({
  templateUrl: './pass-type-delete-dialog.component.html',
})
export class PassTypeDeleteDialogComponent {
  passType?: IPassType;

  constructor(protected passTypeService: PassTypeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.passTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('passTypeListModification');
      this.activeModal.close();
    });
  }
}
