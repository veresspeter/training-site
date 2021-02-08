import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPass, Pass } from 'app/shared/model/pass.model';
import { PassService } from './pass.service';
import { IPassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from 'app/entities/pass-type/pass-type.service';
import { IApplicationUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/application-user.service';

type SelectableEntity = IPassType | IApplicationUser;

@Component({
  selector: 'jhi-pass-update',
  templateUrl: './pass-update.component.html',
})
export class PassUpdateComponent implements OnInit {
  isSaving = false;
  passtypes: IPassType[] = [];
  applicationusers: IApplicationUser[] = [];
  purchasedDp: any;
  validFromDp: any;
  validToDp: any;

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

      this.passTypeService.query().subscribe((res: HttpResponse<IPassType[]>) => (this.passtypes = res.body || []));

      this.applicationUserService.query().subscribe((res: HttpResponse<IApplicationUser[]>) => (this.applicationusers = res.body || []));
    });
  }

  updateForm(pass: IPass): void {
    this.editForm.patchValue({
      id: pass.id,
      purchased: pass.purchased,
      usageNo: pass.usageNo,
      validFrom: pass.validFrom,
      validTo: pass.validTo,
      passTypeId: pass.passTypeId,
      userId: pass.userId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pass = this.createFromForm();
    if (pass.id !== undefined) {
      this.subscribeToSaveResponse(this.passService.update(pass));
    } else {
      this.subscribeToSaveResponse(this.passService.create(pass));
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
}
