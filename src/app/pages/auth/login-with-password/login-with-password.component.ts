import { Component } from '@angular/core';
import { BasicPage } from '../../../core/shares/basic-page';
import { GlobalService } from '../../../core/service/global.server';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { GlobalModule } from '../../../core/modules/global.module';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LinkRegisterForgotPasswordComponent } from "../components/link-register-forgot-password/link-register-forgot-password.component";
import { AuthService } from '../../../core/service/auth.service';
import { CustomToastService } from '../../../core/service/custom-toast.service';


@Component({
  selector: 'app-login-with-password',
  imports: [GlobalModule, AuthLibModule, TranslateModule, LinkRegisterForgotPasswordComponent],
  templateUrl: './login-with-password.component.html',
  styleUrl: './login-with-password.component.scss',
})
export class LoginWithPasswordComponent extends BasicPage {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    protected override globalSer: GlobalService,
    private router: Router,
    private authService: AuthService,
    private toastService: CustomToastService,
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
      this.loginForm.patchValue({
        userName: 'tranthanh0898256009@gmail.com',
        password: 'Thanh2002@',
      });
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }


  loginByPassword() {
    if (this.loginForm.valid) {
      this.globalSer.openLoading();
      this.authService.loginByPassword(this.loginForm.value).subscribe({
        next: () => {
          this.globalSer.closeLoading();
          this.router.navigate(['/manager-file']);
          this.toastService.showToast('success', {
            detail: this.translateService.instant('auth.login-success'),
            sticky: false,
            life: 5000,
          });
        },
        error: (error) => {
          let errorMessage = this.translateService.instant('auth.login-fail');
          const errorCode = error.error.errorCode;
          if (!environment.production) {
            console.log('Error code:', errorCode);
          }

          switch (errorCode) {
            case 'ACCOUNT_NOT_EXIST':
              errorMessage = this.translateService.instant(
                'auth.account-not-exist'
              );
              break;
            case 'ACCOUNT_LOCKED_FAILED_ATTEMPTS':
              errorMessage = this.translateService.instant(
                'auth.account-locked-failed-attempts'
              );
              break;
            case 'INCORRECT-PASSWORD':
              errorMessage = this.translateService.instant(
                'auth.incorrect-password'
              );
              break;
            case 'UNVERIFIED-ACCOUNT':
              errorMessage = this.translateService.instant(
                'auth.unverified-account'
              );
              break;
            case 'ACCOUNT-NOT-ACTIVE':
              errorMessage = this.translateService.instant(
                'auth.account-not-active'
              );
              break;
            case 'SUSPENDED-ACCOUNT':
              errorMessage = this.translateService.instant(
                'auth.suspended-account'
              );
              break;
            case 'ACCOUNT-LOCKED':
              errorMessage = this.translateService.instant(
                'auth.account-locked'
              );
              break;
            case 'INVALID-STATUS':
              errorMessage =
                this.translateService.instant('app.invalid-status');
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

          if(!environment.production) {
          console.error('Error during OTP resend:', error);
          }
          this.globalSer.closeLoading();
        },
      });
    } else {
      console.log('Form không hợp lệ');
    }
  }

  verifyAccount() {

  }




}
