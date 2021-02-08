import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IActivityType, ActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeService } from './activity-type.service';

@Component({
  selector: 'jhi-activity-type-update',
  templateUrl: './activity-type-update.component.html',
})
export class ActivityTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    imageUrl: [null, [Validators.required]],
  });

  constructor(protected activityTypeService: ActivityTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityType }) => {
      this.updateForm(activityType);
    });
  }

  updateForm(activityType: IActivityType): void {
    this.editForm.patchValue({
      id: activityType.id,
      name: activityType.name,
      imageUrl: activityType.imageUrl,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activityType = this.createFromForm();
    if (activityType.id !== undefined) {
      this.subscribeToSaveResponse(this.activityTypeService.update(activityType));
    } else {
      this.subscribeToSaveResponse(this.activityTypeService.create(activityType));
    }
  }

  private createFromForm(): IActivityType {
    return {
      ...new ActivityType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      imageUrl: this.editForm.get(['imageUrl'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivityType>>): void {
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
}
