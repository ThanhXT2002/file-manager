import { Component } from '@angular/core';
import { BasicPage } from '../../../core/shares/basic-page';
import { GlobalModule } from '../../../core/modules/global.module';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/service/global.server';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from '../../../core/validators/password.validator';

@Component({
  selector: 'app-reset-password',
  imports: [GlobalModule, AuthLibModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent extends BasicPage {
  resetPasswordForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    protected override globalSer: GlobalService
  ) {
    super(globalSer);

    this.resetPasswordForm = this.fb.group(
      {
        userName: ['', Validators.required],
        otp: ['', [Validators.required, Validators.minLength(6)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            ...PasswordValidators.strongPassword(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: PasswordValidators.passwordMatch(),
      }
    );
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit(): void {}

  onConfirm() {
    // this.beginCallApi();
    // this.userApi.resetPassword(this.resetData).subscribe({
    //   error: (err) => {
    //     this.messageBoxSer.error(err);
    //   },
    //   next: (res) => {
    //     this.snackSer.success(res);
    //     this.userApi.loginCompletely(res.result ?? '');
    //   },
    //   complete: () => {
    //     this.closeLoadIndicator();
    //   },
    // });
  }

  // Phương thức để kiểm tra lỗi
  hasError(controlName: string, errorName: string): boolean {
    const control = this.resetPasswordForm.get(controlName);
    return (
      !!control &&
      control.hasError(errorName) &&
      (control.dirty || control.touched)
    );
  }

  hasPasswordMismatch(): boolean | undefined {
    return (
      this.resetPasswordForm.hasError('passwordMismatch') &&
      this.resetPasswordForm.get('confirmPassword')?.dirty
    );
  }

  get isConfirmPasswordInvalid(): boolean {
    const confirmControl = this.resetPasswordForm.get('confirmPassword');
    return this.resetPasswordForm.errors?.['passwordMismatch'] ||
      (confirmControl?.touched && confirmControl?.errors)
      ? true
      : false;
  }

  goBack() {
    window.history.go(-1);
  }
}
