import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { AppUser } from 'app/shared/model/application-user.model';
import { IUser } from 'app/core/user/user.model';
import { JhiDataUtils, JhiEventManager, JhiEventWithContent, JhiFileLoadError } from 'ng-jhipster';
import { AlertError } from 'app/shared/alert/alert-error.model';
import * as moment from 'moment';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  currentAccount!: AppUser;
  authorities: string[] = [];
  isSaving = false;
  isEdit = false;
  users: IUser[] = [];
  userBirthDayDp: any;
  success = false;

  editForm = this.fb.group({
    stepper: [],
    id: [],
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    activated: [],
    sex: [],
    userBirthDay: [{ year: 2018, month: 3, day: 28 }, [Validators.required]],
    image: [],
    imageContentType: [],
    injury: [],
    surgery: [],
    heartProblem: [],
    respiratoryDisease: [],
    spineProblem: [],
    regularPain: [],
    medicine: [],
    otherProblem: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected elementRef: ElementRef,
    protected eventManager: JhiEventManager,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(appUser => {
      if (appUser) {
        this.editForm.patchValue({
          stepper: 1,
          id: appUser.id,
          lastName: appUser.internalUser?.lastName,
          firstName: appUser.internalUser?.firstName,
          sex: appUser.sex,
          email: appUser.internalUser?.email,
          userBirthDay: appUser.birthDay ? moment(appUser.birthDay) : '',
          googleToken: appUser.googleToken,
          facebookToken: appUser.facebookToken,
          image: appUser.image,
          imageContentType: appUser.imageContentType,
          introduction: appUser.introduction,
          injury: appUser.injury,
          surgery: appUser.surgery,
          heartProblem: appUser.heartProblem,
          respiratoryDisease: appUser.respiratoryDisease,
          spineProblem: appUser.spineProblem,
          regularPain: appUser.regularPain,
          medicine: appUser.medicine,
          otherProblem: appUser.otherProblem,
        });

        this.currentAccount = appUser;
      }

      this.editForm.disable();
      this.editForm.get(['stepper'])!.enable();
    });
  }

  enableEdit(): void {
    this.isEdit = true;
    this.editForm.enable();
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

  stepToNextTab(): void {
    this.editForm.get(['stepper'])?.setValue(2);
  }

  save(): void {
    this.editForm.markAllAsTouched();

    if (this.editForm.valid) {
      this.isSaving = true;
      this.success = false;

      this.updateAccountWithFormData();
      this.accountService.save(this.currentAccount).subscribe(
        () => {
          this.isSaving = false;
          this.success = true;
          this.editForm.get(['stepper'])!.setValue(1);
          this.isEdit = false;
          this.editForm.disable();
          this.editForm.get(['stepper'])!.enable();

          this.accountService.authenticate(this.currentAccount);
        },
        () => (this.isSaving = false)
      );
    }
  }

  private updateAccountWithFormData(): void {
    this.currentAccount.sex = this.editForm.get(['sex'])!.value;
    this.currentAccount.birthDay = this.editForm.get(['userBirthDay'])!.value;
    this.currentAccount.imageContentType = this.editForm.get(['imageContentType'])!.value;
    this.currentAccount.image = this.editForm.get(['image'])!.value;
    this.currentAccount.injury = this.editForm.get(['injury'])!.value;
    this.currentAccount.surgery = this.editForm.get(['surgery'])!.value;
    this.currentAccount.heartProblem = this.editForm.get(['heartProblem'])!.value;
    this.currentAccount.respiratoryDisease = this.editForm.get(['respiratoryDisease'])!.value;
    this.currentAccount.spineProblem = this.editForm.get(['spineProblem'])!.value;
    this.currentAccount.regularPain = this.editForm.get(['regularPain'])!.value;
    this.currentAccount.medicine = this.editForm.get(['medicine'])!.value;
    this.currentAccount.otherProblem = this.editForm.get(['otherProblem'])!.value;

    if (this.currentAccount.internalUser !== undefined) {
      this.currentAccount.internalUser.firstName = this.editForm.get(['firstName'])!.value;
      this.currentAccount.internalUser.lastName = this.editForm.get(['lastName'])!.value;
      this.currentAccount.internalUser.email = this.editForm.get(['email'])!.value;
      this.currentAccount.internalUser.login = this.editForm.get(['email'])!.value;
    }
  }
}
