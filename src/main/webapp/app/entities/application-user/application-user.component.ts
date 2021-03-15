import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { ApplicationUserDeleteDialogComponent } from 'app/entities/application-user/delete/application-user-delete-dialog.component';

@Component({
  selector: 'jhi-application-user',
  templateUrl: './application-user.component.html',
})
export class ApplicationUserComponent implements OnInit, OnDestroy {
  currentAccount: Account | null = null;
  appUsers?: IAppUser[];
  eventSubscriber?: Subscription;

  constructor(
    protected applicationUserService: ApplicationUserService,
    protected accountService: AccountService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    this.applicationUserService.query().subscribe((res: HttpResponse<IAppUser[]>) => (this.appUsers = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInApplicationUsers();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IAppUser): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInApplicationUsers(): void {
    this.eventSubscriber = this.eventManager.subscribe('applicationUserListModification', () => this.loadAll());
  }

  delete(appUser: IAppUser): void {
    const modalRef = this.modalService.open(ApplicationUserDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appUser = appUser;
  }
}
