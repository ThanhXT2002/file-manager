import { Component } from '@angular/core';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { GlobalModule } from '../../../core/modules/global.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { GlobalService } from '../../../core/service/global.service';
import { Router } from '@angular/router';
import { BasicPage } from '../../../core/shares/basic-page';
import { base64Helper } from '../../../core/helpers/util';
import { PasswordValidators } from '../../../core/validators/password.validator';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subscription, takeWhile } from 'rxjs';
import { AuthService } from '../../../core/service/auth.service';
import { CustomToastService } from '../../../core/service/custom-toast.service';
import { environment } from '../../../../environments/environment';
import { Password } from 'primeng/password';
import { ResponseHandlerService } from '../../../core/service/response-handler.service';
import { FormEmailOtpChildComponent } from "../components/form-email-otp-child/form-email-otp-child.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [GlobalModule, AuthLibModule, FormsModule, FormEmailOtpChildComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent extends BasicPage {
  forgotForm: FormGroup;
  otpStatus: number = 0;

  constructor(
    protected override globalSer: GlobalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private responseHandler: ResponseHandlerService,
    private router: Router
  ) {
    super(globalSer);
    this.forgotForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
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

    if (!environment.production) {
      this.forgotForm.patchValue({
        email: 'tranthanh0898256009@gmail.com',
        password: 'Thanh2002@',
        confirmPassword: 'Thanh2002@',
      });
    }

    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }


  onResetPassword() {
    if (this.forgotForm.valid) {
      const data = this.forgotForm.value;
      console.log('Form data:', data);
      this.globalSer.openLoading();
      this._subscriptions.push(
        this.authService.resetPassword(data).subscribe({
          next: () => {
            this.responseHandler.handleSuccess(
              'auth.reset-password-success',
              () => {
                this.router.navigate(['/auth/login']);
              }
            );
          },
          error: (error) => {
            this.responseHandler.handleErrorWithUnverifiedCheck(
              error,
              () => this.forgotForm.get('email')?.value
            );
          },
        })
      );
    }
  }



 
  // Phương thức để kiểm tra lỗi
  hasError(controlName: string, errorName: string): boolean {
    const control = this.forgotForm.get(controlName);
    return (
      !!control &&
      control.hasError(errorName) &&
      (control.dirty || control.touched)
    );
  }

  hasPasswordMismatch(): boolean | undefined {
    return (
      this.forgotForm.hasError('passwordMismatch') &&
      this.forgotForm.get('confirmPassword')?.dirty
    );
  }

  get isConfirmPasswordInvalid(): boolean {
    const confirmControl = this.forgotForm.get('confirmPassword');
    return this.forgotForm.errors?.['passwordMismatch'] ||
      (confirmControl?.touched && confirmControl?.errors)
      ? true
      : false;
  }

  goBack() {
    window.history.go(-1);
  }
}
