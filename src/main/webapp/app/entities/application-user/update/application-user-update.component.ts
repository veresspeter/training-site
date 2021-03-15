import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IAppUser, AppUser } from 'app/shared/model/application-user.model';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IUser, User } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-application-user-update',
  templateUrl: './application-user-update.component.html',
})
export class ApplicationUserUpdateComponent implements OnInit {
  currentAccount: Account | null = null;
  authorities: string[] = [];
  isSaving = false;
  users: IUser[] = [];
  birthDayDp: any;
  internalUser: User | undefined;

  editForm = this.fb.group({
    id: [],
    lastName: [null, [Validators.required]],
    firstName: [null, [Validators.required]],
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
    protected appUserService: ApplicationUserService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUser }) => {
      this.internalUser = appUser.internalUser;
      this.updateForm(appUser);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    this.userService.authorities().subscribe(authorities => {
      this.authorities = authorities;
    });
  }

  updateForm(appUser: IAppUser): void {
    this.editForm.patchValue({
      id: appUser.id,
      lastName: appUser.internalUser?.lastName,
      firstName: appUser.internalUser?.firstName,
      sex: appUser.sex,
      birthDay: appUser.birthDay,
      googleToken: appUser.googleToken,
      facebookToken: appUser.facebookToken,
      image: appUser.image,
      imageContentType: appUser.imageContentType,
      introduction: appUser.introduction,
      isTrainer: appUser.isTrainer,
      internalUserId: appUser.internalUser?.id,
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
    const appUser = this.createFromForm();
    if (appUser.id !== undefined) {
      this.subscribeToSaveResponse(this.appUserService.update(appUser));
    } else {
      this.subscribeToSaveResponse(this.appUserService.create(appUser));
    }
  }

  private createFromForm(): IAppUser {
    if (this.internalUser !== undefined) {
      this.internalUser.firstName = this.editForm.get(['firstName'])!.value;
      this.internalUser.lastName = this.editForm.get(['lastName'])!.value;
    }
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
      internalUser: this.internalUser,
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
