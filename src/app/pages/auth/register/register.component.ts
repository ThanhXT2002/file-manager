import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { GlobalModule } from '../../../core/modules/global.module';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { GlobalService } from '../../../core/service/global.server';
import { BasicPage } from '../../../core/shares/basic-page';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PasswordValidators } from '../../../core/validators/password.validator';
import { base64Helper } from '../../../core/helpers/util';
import { AuthService } from '../../../core/service/auth.service';
import { CustomToastService } from '../../../core/service/custom-toast.service';

@Component({
  selector: 'app-register',
  imports: [GlobalModule, AuthLibModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent extends BasicPage {
  registerForm!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: CustomToastService,
    protected override globalSer: GlobalService,
    private translateService: TranslateService
  ) {
    super(globalSer);
    this.createForm();
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit(): void {
    if (!environment.production) {
      this.registerForm.patchValue({
        fullName: 'Trần Xuân Thành',
        phone: '0123456789',
        email: 'tranthanh0898256009@gmail.com',
        password: 'Thanh2002@',
        confirmPassword: 'Thanh2002@',
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;
      const encodedData = base64Helper.objectToBase64(email);
      // Call API to register
      this.globalSer.openLoading();
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.globalSer.closeLoading();
          this.toastService.showToast('success', {
            detail: this.translateService.instant('auth.register-success'),
            sticky: false,
            life: 50000,
          });
          // Sau khi đăng ký thành công, điều hướng đến trang xác minh OTP
          this.router.navigate(['/auth/verify-otp-with-email'], {
            queryParams: {
              data: encodedData,
            },
          });
        },
        error: (error) => {
          this.globalSer.closeLoading();
          let errorMessage =
            this.translateService.instant('auth.register-fail');
          const errorCode = error.error.errorCode;
          if (!environment.production) {
            console.log('Error code:', errorCode);
          }

          switch (errorCode) {
            case 'EMAIL_OR_PHONE_EXIST':
              errorMessage = this.translateService.instant(
                'auth.email-or-phone-exist'
              );
              break;
            case 'CFPW':
              errorMessage = this.translateService.instant(
                'auth.confirm-password-not-match'
              );
              break;
            default:
              errorMessage = this.translateService.instant(
                'common.unexpected-error'
              );
              break;
          }

          this.toastService.showToast('error', {
            detail: errorMessage,
            sticky: false,
            life: 5000,
          });
        },
      });
    } else {
      // Đánh dấu tất cả các trường là đã touched để hiển thị lỗi
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  createForm() {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
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
  }

  // Phương thức để kiểm tra lỗi
  hasError(controlName: string, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return (
      !!control &&
      control.hasError(errorName) &&
      (control.dirty || control.touched)
    );
  }

  hasPasswordMismatch(): boolean | undefined {
    return (
      this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.dirty
    );
  }
}
