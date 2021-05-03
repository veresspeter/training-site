import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IActivity, Activity } from 'app/shared/model/activity.model';
import { ActivityService } from '../../shared/services/activity.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { IAppUser } from 'app/shared/model/application-user.model';

@Component({
  selector: 'jhi-activity-update',
  templateUrl: './activity-update.component.html',
})
export class ActivityUpdateComponent implements OnInit {
  isSaving = false;
  activityTypes: IActivityType[] = [];
  appUsers: IAppUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [undefined, [Validators.required]],
    description: [undefined, [Validators.required]],
    image: [undefined, [Validators.required]],
    imageContentType: [],
    activityTypeId: [undefined, Validators.required],
    externalLink: [],
    trainer: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected activityService: ActivityService,
    protected activityTypeService: ActivityTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected appUserService: ApplicationUserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activity }) => {
      this.updateForm(activity);

      this.activityTypeService.query().subscribe((res: HttpResponse<IActivityType[]>) => (this.activityTypes = res.body || []));
      this.appUserService.query().subscribe((res: HttpResponse<IAppUser[]>) => (this.appUsers = res.body || []));
    });
  }

  updateForm(activity: IActivity): void {
    this.editForm.patchValue({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      image: activity.image,
      imageContentType: activity.imageContentType,
      activityTypeId: activity.activityTypeId,
      externalLink: activity.externalLink,
      trainer: activity.trainer?.id,
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: any, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('trainingsiteApp.error', { message: err.message })
      );
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.isSaving = true;
      const activity = this.createFromForm();
      if (activity.id !== undefined) {
        this.subscribeToSaveResponse(this.activityService.update(activity));
      } else {
        this.subscribeToSaveResponse(this.activityService.create(activity));
      }
    }
  }

  private createFromForm(): IActivity {
    return {
      ...new Activity(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      activityTypeId: this.editForm.get(['activityTypeId'])!.value,
      externalLink: this.editForm.get(['externalLink'])!.value,
      trainer: this.appUsers.find(appUser => appUser.id === this.editForm.get(['trainer'])!.value),
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivity>>): void {
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

  trackById(index: number, item: IActivityType): any {
    return item.id;
  }

  trackByUserId(index: number, item: IAppUser): any {
    return item.id;
  }
}
