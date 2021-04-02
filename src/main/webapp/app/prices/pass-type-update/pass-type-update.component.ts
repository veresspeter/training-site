import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPassType, PassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { IActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';
import { IActivity } from 'app/shared/model/activity.model';
import { ActivityService } from 'app/shared/services/activity.service';

type SelectableEntity = IActivityType | IActivity;

@Component({
  selector: 'jhi-pass-type-update',
  templateUrl: './pass-type-update.component.html',
})
export class PassTypeUpdateComponent implements OnInit {
  isSaving = false;
  activityTypes: IActivityType[] = [];
  activities: IActivity[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    billingName: [null, [Validators.required]],
    description: [],
    durationDays: [],
    price: [null, [Validators.required]],
    unit: [null, [Validators.required]],
    occasions: [null, [Validators.required]],
    availableForType: [null, Validators.required],
    availableForActivityId: [],
  });

  constructor(
    protected passTypeService: PassTypeService,
    protected activityTypeService: ActivityTypeService,
    protected activityService: ActivityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ passType }) => {
      this.updateForm(passType);

      this.activityTypeService.query().subscribe((res: HttpResponse<IActivityType[]>) => (this.activityTypes = res.body || []));

      this.activityService.query().subscribe((res: HttpResponse<IActivity[]>) => (this.activities = res.body || []));
    });
  }

  updateForm(passType: IPassType): void {
    this.editForm.patchValue({
      id: passType.id,
      name: passType.name,
      billingName: passType.billingName,
      description: passType.description,
      durationDays: passType.durationDays,
      price: passType.price,
      unit: passType.unit,
      occasions: passType.occasions,
      availableForType: passType.availableForType?.id,
      availableForActivityId: passType.availableForActivityId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.editForm.markAllAsTouched();

    if (this.editForm.valid) {
      this.isSaving = true;
      const passType = this.createFromForm();
      if (passType.id !== undefined) {
        this.subscribeToSaveResponse(this.passTypeService.update(passType));
      } else {
        this.subscribeToSaveResponse(this.passTypeService.create(passType));
      }
    }
  }

  private createFromForm(): IPassType {
    return {
      ...new PassType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      billingName: this.editForm.get(['billingName'])!.value,
      description: this.editForm.get(['description'])!.value,
      durationDays: this.editForm.get(['durationDays'])!.value,
      price: this.editForm.get(['price'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      occasions: this.editForm.get(['occasions'])!.value,
      availableForType: this.activityTypes.find(type => type.id === this.editForm.get(['availableForType'])!.value),
      availableForActivityId: this.editForm.get(['availableForActivityId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPassType>>): void {
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
