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
import { ResponseHandlerService } from '../../../core/service/response-handler.service';

@Component({
  selector: 'app-verify-account-by-email',
  imports: [GlobalModule, AuthLibModule],
  templateUrl: './verify-account-by-email.component.html',
  styleUrl: './verify-account-by-email.component.scss',
})
export class VerifyAccountByEmailComponent
  extends BasicPage
  implements OnInit, OnDestroy
{
  verifyAccountForm!: FormGroup;
  email!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: CustomToastService,
    protected override globalSer: GlobalService,
    private translateService: TranslateService,
    private responseHandler: ResponseHandlerService
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
        this.toastService.showToast('info', {
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
      this.authService
        .verifyRegisterOtp(this.verifyAccountForm.value)
        .subscribe({
          next: () => {
            this.responseHandler.handleSuccess(
              'auth.verify-account-success',
              () => {
                setTimeout(() => {
                  this.router.navigate(['/auth/login']);
                }, 1000);
              }
            );
          },
          error: (error) => {
            this.responseHandler.handleError(error);
          },
        });
    }
  }

  onResendOtp() {
    if (this.verifyAccountForm.get('email')?.valid) {
      const email = this.verifyAccountForm.get('email')?.value;
      this.globalSer.openLoading();
      this.authService.resendRegisterOtp(email).subscribe({
        next: () => {
          this.responseHandler.handleSuccess('auth.send-otp-success', () => {
            this.verifyAccountForm.get('otp')?.setValue('');
          });
        },
        error: (error) => {
          this.responseHandler.handleError(error);
        },
      });
    }
  }

  goBack() {
    window.history.go(-1);
  }
}
