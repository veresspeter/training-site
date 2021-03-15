import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';

@Component({
  templateUrl: './application-user-delete-dialog.component.html',
})
export class ApplicationUserDeleteDialogComponent {
  appUser?: IAppUser;

  constructor(
    protected applicationUserService: ApplicationUserService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.applicationUserService.delete(id).subscribe(() => {
      this.eventManager.broadcast('applicationUserListModification');
      this.activeModal.close();
    });
  }
}
