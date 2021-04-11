import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPassType } from 'app/shared/model/pass-type.model';
import { Subscription } from 'rxjs';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { PassTypeDeleteDialogComponent } from 'app/prices/pass-type-delete/pass-type-delete-dialog.component';
import { IActivityType } from 'app/shared/model/activity-type.model';
import { PassService } from 'app/shared/services/pass.service';
import { AccountService } from 'app/core/auth/account.service';
import { IAppUser } from 'app/shared/model/application-user.model';
import { LoginModalService } from 'app/core/login/login-modal.service';

@Component({
  selector: 'jhi-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit, OnDestroy {
  passTypes?: IPassType[];
  activityTypes?: IActivityType[];
  eventSubscriber?: Subscription;
  loading = true;
  account: IAppUser | undefined;

  constructor(
    protected passTypeService: PassTypeService,
    protected passService: PassService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected loginModalService: LoginModalService
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPassTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  loadAll(): void {
    this.passTypeService.query().subscribe((res: HttpResponse<IPassType[]>) => {
      this.passTypes = res.body || [];
      this.activityTypes = [];

      this.passTypes.forEach(passType => {
        if (
          passType.availableForType !== undefined &&
          this.activityTypes?.find(activityType => activityType.id === passType.availableForType?.id) === undefined
        ) {
          this.activityTypes?.push(passType.availableForType);
        }
      });

      this.activityTypes = this.activityTypes.reverse();

      this.loading = false;
    });

    this.accountService.identity().subscribe(account => {
      if (account !== null) {
        this.account = account;
      }
    });
  }

  getPassTypesByActivityType(activityType: IActivityType): IPassType[] {
    return this.passTypes?.filter(passType => passType.availableForType?.id === activityType.id) || [];
  }

  durationToString(duration: number): string {
    if (duration % 7 === 0) {
      return duration / 7 + ' hétig';
    }

    return duration + ' napig';
  }

  trackId(index: number, item: IPassType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPassTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('pricesListModification', () => this.loadAll());
  }

  delete(passType: IPassType): void {
    const modalRef = this.modalService.open(PassTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.passType = passType;
  }

  purchase(passTypeId: number | undefined): void {
    if (!this.account) {
      this.loginModalService.open();
      return;
    }

    if (passTypeId) {
      this.passService.purchase(passTypeId).subscribe(res => {
        if (res.body) {
          window.location.href = res.body;
        }
      });
    }
  }
}
