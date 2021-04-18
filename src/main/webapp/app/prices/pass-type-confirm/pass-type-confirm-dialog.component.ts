import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { PassService } from 'app/shared/services/pass.service';

@Component({
  templateUrl: './pass-type-confirm-dialog.component.html',
})
export class PassTypeConfirmDialogComponent {
  passType?: IPassType;

  constructor(
    protected passTypeService: PassTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    protected passService: PassService
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmPurchase(passTypeId: number | undefined): void {
    if (passTypeId) {
      this.passService.purchase(passTypeId).subscribe(res => {
        if (res.body) {
          window.location.href = res.body;
        }
      });
    }
  }
}
