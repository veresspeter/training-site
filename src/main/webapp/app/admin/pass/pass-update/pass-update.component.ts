import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPass, Pass } from 'app/shared/model/pass.model';
import { IPassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { IAppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { PassService } from 'app/shared/services/pass.service';
import { formatNumber } from '@angular/common';
import * as moment from 'moment/moment';

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

  editForm = this.fb.group({
    id: [],
    purchased: [null, [Validators.required]],
    usageNo: [null, [Validators.required]],
    validFrom: [],
    validTo: [],
    passTypeId: [null, Validators.required],
    userId: [null, Validators.required],
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
    this.editForm.patchValue({
      id: pass.id,
      purchased: pass.purchased ? pass.purchased : moment(new Date()),
      usageNo: pass.usageNo ? pass.usageNo : 0,
      validFrom: pass.validFrom,
      validTo: pass.validTo,
      passTypeId: pass.passTypeId,
      userId: pass.userId,
    });

    if (pass.id === undefined) {
      this.isEdit = true;
    } else {
      this.editForm.disable();
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.editForm.markAllAsTouched();

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
      purchased: this.editForm.get(['purchased'])!.value,
      usageNo: this.editForm.get(['usageNo'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value,
      validTo: this.editForm.get(['validTo'])!.value,
      passTypeId: this.editForm.get(['passTypeId'])!.value,
      userId: this.editForm.get(['userId'])!.value,
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
  }
}
