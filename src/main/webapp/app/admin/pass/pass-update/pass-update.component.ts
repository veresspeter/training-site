import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { IPass, Pass } from 'app/shared/model/pass.model';
import { IPassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { IAppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { PassService } from 'app/shared/services/pass.service';
import { formatNumber } from '@angular/common';
import * as moment from 'moment/moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';

type SelectableEntity = IPassType | IAppUser;

@Component({
  selector: 'jhi-pass-update',
  templateUrl: './pass-update.component.html',
})
export class PassUpdateComponent implements OnInit {
  isSaving = false;
  passTypes: IPassType[] = [];
  appUsers: IAppUser[] = [];
  purchasedDp: any;
  validFromDp: any;
  validToDp: any;
  isEdit = false;
  subs: Subscription[] = [];

  editForm = this.fb.group({
    id: [],
    purchased: [undefined, [Validators.required]],
    usageNo: [undefined, [Validators.required]],
    dynamicUsageNo: [],
    paymentStatus: [undefined, [Validators.required]],
    validFrom: [undefined, [Validators.required]],
    validTo: [],
    passTypeId: [undefined, Validators.required],
    userId: [undefined, Validators.required],
    paymentId: [],
    paymentBarionStatus: [],
    paymentBarionTimestamp: [],
  });

  constructor(
    protected passService: PassService,
    protected passTypeService: PassTypeService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pass }) => {
      this.updateForm(pass);

      this.passTypeService.query().subscribe((res: HttpResponse<IPassType[]>) => (this.passTypes = res.body || []));
      this.applicationUserService.query().subscribe((res: HttpResponse<IAppUser[]>) => (this.appUsers = res.body || []));
    });
  }

  updateForm(pass: IPass): void {
    if (!pass.purchased) {
      pass.purchased = moment();
      pass.validFrom = moment().startOf('day');
    }

    const usage = pass.usageNo ? pass.usageNo : 0;
    const dynamicNo = pass.totalUsageNo ? pass.totalUsageNo - usage : 0;

    this.editForm.patchValue({
      id: pass.id,
      purchased: moment(pass.purchased, DATE_TIME_FORMAT),
      usageNo: pass.usageNo ? pass.usageNo : 0,
      dynamicUsageNo: dynamicNo,
      paymentStatus: pass.paymentStatus ? pass.paymentStatus : this.paymentStatus.PAID.Value,
      validFrom: moment(pass.validFrom, DATE_FORMAT),
      validTo: pass.validTo ? moment(pass.validTo, DATE_FORMAT) : null,
      passTypeId: pass.passTypeId,
      userId: pass.userId,
      paymentId: pass.paymentId,
      paymentBarionStatus: pass.paymentBarionStatus,
      paymentBarionTimestamp: pass.paymentBarionTimestamp,
    });

    if (pass.id === undefined) {
      this.enableEdit();
    } else {
      this.editForm.disable();
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.editForm.markAllAsTouched();

    // eslint-disable-next-line no-console
    console.log(this.editForm.valid);

    if (this.editForm.valid) {
      this.isSaving = true;
      const pass = this.createFromForm();
      if (pass.id !== undefined) {
        this.subscribeToSaveResponse(this.passService.update(pass));
      } else {
        this.subscribeToSaveResponse(this.passService.create(pass));
      }
    }
  }

  private createFromForm(): IPass {
    return {
      ...new Pass(),
      id: this.editForm.get(['id'])!.value,
      purchased: this.editForm.get(['purchased'])!.value ? moment(this.editForm.get(['purchased'])!.value, DATE_FORMAT) : undefined,
      usageNo: this.editForm.get(['usageNo'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value
        ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT).utc(true)
        : undefined,
      validTo: this.editForm.get(['validTo'])!.value
        ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT).utc(true)
        : undefined,
      passTypeId: this.editForm.get(['passTypeId'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      paymentId: this.editForm.get(['paymentId'])!.value,
      paymentBarionStatus: this.editForm.get(['paymentBarionStatus'])!.value,
      paymentBarionTimestamp: this.editForm.get(['paymentBarionTimestamp'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPass>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getUserNameById(id: number | undefined): string {
    const result = this.appUsers.find(user => user.id === id);

    return `${result?.internalUser?.lastName} ${result?.internalUser?.firstName}`;
  }

  getPassTypeNameById(id: number | undefined): string | undefined {
    const result = this.passTypes.find(type => type.id === id);

    return `${result?.name} (${result?.price ? formatNumber(result.price, 'hu', '1.0') : '?'} ${result?.unit})`;
  }

  enableEdit(): void {
    this.isEdit = true;
    this.editForm.enable();
    this.editForm.get('dynamicUsageNo')?.disable();

    const passTypeIdValueChanges = this.editForm.get('passTypeId')?.valueChanges;
    if (passTypeIdValueChanges) {
      this.subs.push(
        passTypeIdValueChanges.subscribe(passTypeId => {
          const validFrom = moment(this.editForm.get('validFrom')?.value, DATE_FORMAT);
          const durationDays = this.passTypes.find(passType => passType.id === passTypeId)?.durationDays;

          if (validFrom && durationDays) {
            this.editForm.get('validTo')?.setValue(validFrom.add(durationDays, 'days'));
          }
        })
      );
    }

    const validFromValueChanges = this.editForm.get('validFrom')?.valueChanges;
    if (validFromValueChanges) {
      this.subs.push(
        validFromValueChanges.subscribe(validFrom => {
          const validFromMoment = moment(validFrom, DATE_FORMAT);
          const passTypeId = this.editForm.get('passTypeId')?.value;
          const durationDays = this.passTypes.find(passType => passType.id === passTypeId)?.durationDays;

          if (passTypeId && durationDays) {
            this.editForm.get('validTo')?.setValue(validFromMoment.add(durationDays, 'days'));
          }
        })
      );
    }
  }

  public get paymentStatus(): typeof PaymentStatus {
    return PaymentStatus;
  }
}
