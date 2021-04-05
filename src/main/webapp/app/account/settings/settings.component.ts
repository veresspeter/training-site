import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { AppUser } from 'app/shared/model/application-user.model';
import { IUser } from 'app/core/user/user.model';
import { JhiDataUtils, JhiEventManager, JhiEventWithContent, JhiFileLoadError } from 'ng-jhipster';
import { AlertError } from 'app/shared/alert/alert-error.model';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  public static readonly NONE = 'Nincs';

  currentAccount!: AppUser;
  authorities: string[] = [];
  isSaving = false;
  isEdit = false;
  users: IUser[] = [];
  userBirthDayDp: any;
  success = false;

  injuryText: string | undefined;
  surgeryText: string | undefined;
  heartProblemText: string | undefined;
  respiratoryDiseaseText: string | undefined;
  spineProblemText: string | undefined;
  regularPainText: string | undefined;
  medicineText: string | undefined;
  otherProblemText: string | undefined;

  editForm = this.fb.group({
    stepper: [],
    id: [],
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    activated: [],
    sex: [],
    userBirthDay: [undefined, [Validators.required]],
    image: [],
    imageContentType: [],
    injury: [undefined, [Validators.required]],
    injuryText: [],
    surgery: [undefined, [Validators.required]],
    surgeryText: [],
    heartProblem: [undefined, [Validators.required]],
    heartProblemText: [],
    respiratoryDisease: [undefined, [Validators.required]],
    respiratoryDiseaseText: [],
    spineProblem: [undefined, [Validators.required]],
    spineProblemText: [],
    regularPain: [undefined, [Validators.required]],
    regularPainText: [],
    medicine: [undefined, [Validators.required]],
    medicineText: [],
    otherProblem: [undefined, [Validators.required]],
    otherProblemText: [],
    gdprAccepted: [undefined, [Validators.required]],
    selfResponsibility: [undefined, [Validators.required]],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected elementRef: ElementRef,
    protected eventManager: JhiEventManager,
    private accountService: AccountService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setUpEventListeners();

    this.accountService.identity().subscribe(appUser => {
      if (appUser) {
        this.initTextValues(appUser);

        this.editForm.patchValue({
          stepper: 1,
          id: appUser.id,
          lastName: appUser.internalUser?.lastName,
          firstName: appUser.internalUser?.firstName,
          sex: appUser.sex,
          email: appUser.internalUser?.email,
          userBirthDay: appUser.birthDay ? moment(appUser.birthDay, DATE_FORMAT) : null,
          googleToken: appUser.googleToken,
          facebookToken: appUser.facebookToken,
          image: appUser.image,
          imageContentType: appUser.imageContentType,
          introduction: appUser.introduction,
          injury: appUser.injury,
          injuryText: appUser.injury && appUser.injury !== SettingsComponent.NONE ? appUser.injury : undefined,
          surgery: appUser.surgery,
          surgeryText: appUser.surgery && appUser.surgery !== SettingsComponent.NONE ? appUser.surgery : undefined,
          heartProblem: appUser.heartProblem,
          heartProblemText: appUser.heartProblem && appUser.heartProblem !== SettingsComponent.NONE ? appUser.heartProblem : undefined,
          respiratoryDisease: appUser.respiratoryDisease,
          respiratoryDiseaseText:
            appUser.respiratoryDisease && appUser.respiratoryDisease !== SettingsComponent.NONE ? appUser.respiratoryDisease : undefined,
          spineProblem: appUser.spineProblem,
          spineProblemText: appUser.spineProblem && appUser.spineProblem !== SettingsComponent.NONE ? appUser.spineProblem : undefined,
          regularPain: appUser.regularPain,
          regularPainText: appUser.regularPain && appUser.regularPain !== SettingsComponent.NONE ? appUser.regularPain : undefined,
          medicine: appUser.medicine,
          medicineText: appUser.medicine && appUser.medicine !== SettingsComponent.NONE ? appUser.medicine : undefined,
          otherProblem: appUser.otherProblem,
          otherProblemText: appUser.otherProblem && appUser.otherProblem !== SettingsComponent.NONE ? appUser.otherProblem : undefined,
          gdprAccepted: appUser.gdprAccepted,
          selfResponsibility: appUser.selfResponsibility,
        });

        this.currentAccount = appUser;

        if (this.isAllDataGiven()) {
          this.editForm.disable();
          this.editForm.get(['stepper'])!.enable();
        } else {
          this.isEdit = true;
        }
      }
    });
  }

  private initTextValues(appUser: AppUser): void {
    if (appUser.injury && appUser.injury !== SettingsComponent.NONE) {
      this.injuryText = appUser.injury;
    }
    if (appUser.surgery && appUser.surgery !== SettingsComponent.NONE) {
      this.surgeryText = appUser.surgery;
    }
    if (appUser.heartProblem && appUser.heartProblem !== SettingsComponent.NONE) {
      this.heartProblemText = appUser.heartProblem;
    }
    if (appUser.respiratoryDisease && appUser.respiratoryDisease !== SettingsComponent.NONE) {
      this.respiratoryDiseaseText = appUser.respiratoryDisease;
    }
    if (appUser.spineProblem && appUser.spineProblem !== SettingsComponent.NONE) {
      this.spineProblemText = appUser.spineProblem;
    }
    if (appUser.regularPain && appUser.regularPain !== SettingsComponent.NONE) {
      this.regularPainText = appUser.regularPain;
    }
    if (appUser.medicine && appUser.medicine !== SettingsComponent.NONE) {
      this.medicineText = appUser.medicine;
    }
    if (appUser.otherProblem && appUser.otherProblem !== SettingsComponent.NONE) {
      this.otherProblemText = appUser.otherProblem;
    }
  }

  private setUpEventListeners(): void {
    this.editForm.get('injuryText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        this.injuryText = val;
        this.editForm.get('injury')?.setValue(val);
        this.cd.detectChanges();
      }
    });
    this.editForm.get('surgeryText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        setTimeout(() => {
          this.surgeryText = val;
          this.editForm.get('surgery')?.setValue(val);
          this.cd.detectChanges();
        });
      }
    });
    this.editForm.get('heartProblemText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        setTimeout(() => {
          this.heartProblemText = val;
          this.editForm.get('heartProblem')?.setValue(val);
          this.cd.detectChanges();
        });
      }
    });
    this.editForm.get('respiratoryDiseaseText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        setTimeout(() => {
          this.respiratoryDiseaseText = val;
          this.editForm.get('respiratoryDisease')?.setValue(val);
          this.cd.detectChanges();
        });
      }
    });
    this.editForm.get('spineProblemText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        setTimeout(() => {
          this.spineProblemText = val;
          this.editForm.get('spineProblem')?.setValue(val);
          this.cd.detectChanges();
        });
      }
    });
    this.editForm.get('regularPainText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        setTimeout(() => {
          this.regularPainText = val;
          this.editForm.get('regularPain')?.setValue(val);
          this.cd.detectChanges();
        });
      }
    });
    this.editForm.get('medicineText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        setTimeout(() => {
          this.medicineText = val;
          this.editForm.get('medicine')?.setValue(val);
          this.cd.detectChanges();
        });
      }
    });
    this.editForm.get('otherProblemText')?.valueChanges.subscribe(val => {
      if (val !== undefined) {
        setTimeout(() => {
          this.otherProblemText = val;
          this.editForm.get('otherProblem')?.setValue(val);
          this.cd.detectChanges();
        });
      }
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
    this.currentAccount.birthDay = this.editForm.get(['userBirthDay'])!.value
      ? moment(this.editForm.get(['userBirthDay'])!.value, DATE_FORMAT).utc(true)
      : undefined;
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
    this.currentAccount.gdprAccepted = this.editForm.get(['gdprAccepted'])!.value;
    this.currentAccount.selfResponsibility = this.editForm.get(['selfResponsibility'])!.value;

    if (this.currentAccount.internalUser !== undefined) {
      this.currentAccount.internalUser.firstName = this.editForm.get(['firstName'])!.value;
      this.currentAccount.internalUser.lastName = this.editForm.get(['lastName'])!.value;
      this.currentAccount.internalUser.email = this.editForm.get(['email'])!.value;
      this.currentAccount.internalUser.login = this.editForm.get(['email'])!.value;
    }
  }

  isAllDataGiven(): boolean {
    this.editForm.markAllAsTouched();
    return (
      this.currentAccount?.internalUser?.lastName !== undefined &&
      this.currentAccount?.internalUser?.firstName !== undefined &&
      this.currentAccount?.birthDay !== undefined &&
      this.currentAccount?.sex !== undefined &&
      this.currentAccount?.internalUser?.email !== undefined &&
      this.currentAccount?.injury !== undefined &&
      this.currentAccount?.surgery !== undefined &&
      this.currentAccount?.heartProblem !== undefined &&
      this.currentAccount?.respiratoryDisease !== undefined &&
      this.currentAccount?.spineProblem !== undefined &&
      this.currentAccount?.regularPain !== undefined &&
      this.currentAccount?.medicine !== undefined &&
      this.currentAccount?.otherProblem !== undefined &&
      this.currentAccount?.gdprAccepted === true &&
      this.currentAccount?.selfResponsibility === true
    );
  }

  getNone(): string {
    return SettingsComponent.NONE;
  }
}
