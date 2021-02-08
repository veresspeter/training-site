import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IApplicationUser, ApplicationUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from './application-user.service';
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
    credit: [null, [Validators.required]],
    sex: [],
    birthDay: [],
    googleToken: [],
    facebookToken: [],
    imageUrl: [],
    introduction: [],
    internalUserId: [null, Validators.required],
  });

  constructor(
    protected applicationUserService: ApplicationUserService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUser }) => {
      this.updateForm(applicationUser);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(applicationUser: IApplicationUser): void {
    this.editForm.patchValue({
      id: applicationUser.id,
      credit: applicationUser.credit,
      sex: applicationUser.sex,
      birthDay: applicationUser.birthDay,
      googleToken: applicationUser.googleToken,
      facebookToken: applicationUser.facebookToken,
      imageUrl: applicationUser.imageUrl,
      introduction: applicationUser.introduction,
      internalUserId: applicationUser.internalUserId,
    });
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

  private createFromForm(): IApplicationUser {
    return {
      ...new ApplicationUser(),
      id: this.editForm.get(['id'])!.value,
      credit: this.editForm.get(['credit'])!.value,
      sex: this.editForm.get(['sex'])!.value,
      birthDay: this.editForm.get(['birthDay'])!.value,
      googleToken: this.editForm.get(['googleToken'])!.value,
      facebookToken: this.editForm.get(['facebookToken'])!.value,
      imageUrl: this.editForm.get(['imageUrl'])!.value,
      introduction: this.editForm.get(['introduction'])!.value,
      internalUserId: this.editForm.get(['internalUserId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicationUser>>): void {
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
