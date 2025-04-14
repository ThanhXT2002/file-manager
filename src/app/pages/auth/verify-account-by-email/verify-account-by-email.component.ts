import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { GlobalModule } from '../../../core/modules/global.module';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../core/service/global.service';
import { BasicPage } from '../../../core/shares/basic-page';
import { base64Helper } from '../../../core/helpers/util';
import { AuthService } from '../../../core/service/auth.service';
import { CustomToastService } from '../../../core/service/custom-toast.service';
import { environment } from '../../../../environments/environment';
import { timer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-account-by-email',
  imports: [GlobalModule, AuthLibModule],
  templateUrl: './verify-account-by-email.component.html',
  styleUrl: './verify-account-by-email.component.scss',
})
export class VerifyAccountByEmailComponent extends BasicPage implements OnInit, OnDestroy {
  verifyAccountForm!: FormGroup;
  email!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastSer: CustomToastService,
    protected override globalSer: GlobalService,
    private translateService: TranslateService
  ) {
    super(globalSer);
    this.route.queryParams.subscribe((params) => {
      const encodedData = params['data'];
      if (encodedData) {
        const email = base64Helper.base64ToObject<string>(encodedData);
        if (email !== null) {
          this.email = email;
        } else {
          this.router.navigate(['/auth/register']);
        }
      }
    });

    this.verifyAccountForm = this.fb.group({
      email: [this.email, Validators.required],
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit(): void {
    this._subscriptions.push(
      timer(10000).subscribe(() => {
        this.toastSer.showToast('info', {
          detail: this.translateService.instant('app.info-resend-otp'),
          sticky: false,
          life: 500000,
        });
      })
    );
  }

  onVerifyOtp() {
    if (this.verifyAccountForm.valid) {
      this.globalSer.openLoading();
      this.authService.verifyOtp(this.verifyAccountForm.value).subscribe({
        next: () => {
          this.toastSer.showToast('success', {
            detail: this.translateService.instant(
              'auth.verify-account-success'
            ),
            sticky: false,
            life: 5000,
          });
          setTimeout(() => {
            this.globalSer.closeLoading();
            this.router.navigate(['/auth/login']);
          }, 1000);
        },
        error: (error) => {
          this.globalSer.closeLoading();
          let errorMessage = this.translateService.instant(
            'auth.verify-account-fail'
          );
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
            case 'NOT-HAVE-OTP-FOR-ACCOUNT':
              errorMessage = this.translateService.instant(
                'auth.not-have-otp-for-account'
              );
              break;
            case 'OTP-INCORRECTLY':
              errorMessage = this.translateService.instant(
                'auth.otp-incorrectly'
              );
              break;
            default:
              errorMessage = this.translateService.instant(
                'common.unexpected-error'
              );
              break;
          }

          this.toastSer.showToast('error', {
            detail: errorMessage,
            sticky: false,
            life: 5000,
          });
        },
      });
    }
  }

  onResendOtp() {
    if (this.verifyAccountForm.get('email')?.valid) {
      const email = this.verifyAccountForm.get('email')?.value;
      // Call API to resend OTP
      this.globalSer.openLoading();

      this.authService.resendOtp(email).subscribe({
        next: (response) => {
          this.toastSer.showToast('success', {
            detail: this.translateService.instant('auth.send-otp-success'),
            sticky: false,
            life: 5000,
          });
          this.verifyAccountForm.get('otp')?.setValue('');
          this.globalSer.closeLoading();
        },
        error: (error) => {
          let errorMessage =
            this.translateService.instant('auth.send-otp-fail');
          const errorCode = error.error.errorCode;
          if (!environment.production) {
            console.log('Error code:', errorCode);
          }
          if (errorCode === 'ACCOUNT_NOT_EXIST') {
            errorMessage = this.translateService.instant(
              'auth.account-not-exist'
            );
          }

          this.toastSer.showToast('error', {
            detail: errorMessage,
            sticky: false,
            life: 5000,
          });

          console.error('Error during OTP resend:', error);
          this.globalSer.closeLoading();
        },
        complete: () => {
          this.globalSer.closeLoading();
        },
      });
    }
  }

  goBack() {
    window.history.go(-1);
  }
}
