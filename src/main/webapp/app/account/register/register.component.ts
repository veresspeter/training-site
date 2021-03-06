import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared/constants/error.constants';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { RegisterService } from './register.service';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.scss'],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;

  showPsw = false;
  showRePsw = false;

  registerForm = this.fb.group({
    login: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(254),
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });

  constructor(private loginModalService: LoginModalService, private registerService: RegisterService, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  register(): void {
    this.registerForm.get('login')?.setValue(this.registerForm.get(['email'])?.value);

    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.doNotMatch = false;
      this.error = false;
      this.errorEmailExists = false;
      this.errorUserExists = false;

      const password = this.registerForm.get(['password'])!.value;
      if (password !== this.registerForm.get(['confirmPassword'])!.value) {
        this.doNotMatch = true;
      } else {
        const login = this.registerForm.get(['login'])!.value;
        const email = this.registerForm.get(['email'])!.value;
        this.registerService.save({ login, email, password, langKey: 'en' }).subscribe(
          () => (this.success = true),
          response => this.processError(response)
        );
      }
    }
  }

  togglePsw(): void {
    this.showPsw = !this.showPsw;
  }

  toggleRePsw(): void {
    this.showRePsw = !this.showRePsw;
  }

  openLogin(): void {
    this.loginModalService.open();
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
