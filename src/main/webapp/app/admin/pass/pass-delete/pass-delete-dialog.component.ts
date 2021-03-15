import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPass } from 'app/shared/model/pass.model';
import { PassService } from 'app/shared/services/pass.service';

@Component({
  templateUrl: './pass-delete-dialog.component.html',
})
export class PassDeleteDialogComponent {
  pass?: IPass;

  constructor(protected passService: PassService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.passService.delete(id).subscribe(() => {
      this.eventManager.broadcast('passListModification');
      this.activeModal.close();
    });
  }
}
