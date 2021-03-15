import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IAppUser, AppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from '../../../shared/services/application-user.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-application-user-update',
  templateUrl: './application-user-update.component.html',
})
export class ApplicationUserUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];
  birthDayDp: any;

  editForm = this.fb.group({
    id: [],
    sex: [],
    birthDay: [],
    googleToken: [],
    facebookToken: [],
    image: [],
    imageContentType: [],
    introduction: [],
    isTrainer: [null, [Validators.required]],
    internalUserId: [null, Validators.required],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected applicationUserService: ApplicationUserService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUser }) => {
      this.updateForm(appUser);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(applicationUser: IAppUser): void {
    this.editForm.patchValue({
      id: applicationUser.id,
      sex: applicationUser.sex,
      birthDay: applicationUser.birthDay,
      googleToken: applicationUser.googleToken,
      facebookToken: applicationUser.facebookToken,
      image: applicationUser.image,
      imageContentType: applicationUser.imageContentType,
      introduction: applicationUser.introduction,
      isTrainer: applicationUser.isTrainer,
      internalUserId: applicationUser.internalUserId,
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
        new JhiEventWithContent<AlertError>('maxmoveApp.error', { message: err.message })
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
    this.isSaving = true;
    const applicationUser = this.createFromForm();
    if (applicationUser.id !== undefined) {
      this.subscribeToSaveResponse(this.applicationUserService.update(applicationUser));
    } else {
      this.subscribeToSaveResponse(this.applicationUserService.create(applicationUser));
    }
  }

  private createFromForm(): IAppUser {
    return {
      ...new AppUser(),
      id: this.editForm.get(['id'])!.value,
      sex: this.editForm.get(['sex'])!.value,
      birthDay: this.editForm.get(['birthDay'])!.value,
      googleToken: this.editForm.get(['googleToken'])!.value,
      facebookToken: this.editForm.get(['facebookToken'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      introduction: this.editForm.get(['introduction'])!.value,
      isTrainer: this.editForm.get(['isTrainer'])!.value,
      internalUserId: this.editForm.get(['internalUserId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppUser>>): void {
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

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}
